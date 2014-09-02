using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using HappyBall.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity.Spatial;

namespace HappyBall.Controllers.Api
{
    public class GeoMasterController : ApiController
    {
        private UserManager<ApplicationUser> manager;
        private ApplicationDbContext db = new ApplicationDbContext();

        public GeoMasterController()
        {
            manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }


        // GET api/GeoMaster
        public IQueryable<GeoMaster> GetGeoMasters()
        {
            return db.GeoMasters;
        }

        // GET api/geomaster/week
        [ResponseType(typeof(GeoMaster))]
        [System.Web.Http.Route("api/geomaster/week", Name = "GetGeoMasterByWeek")]
        public IHttpActionResult GetGeoMasterByWeek()
        {
            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            var geomaster = db.GeoMasters.Where(x => x.Week == weekId).FirstOrDefault();

            if (geomaster == null)
            {
                return NotFound();
            }

            return Ok(geomaster);
        }

        // PUT api/GeoMaster/5
        public IHttpActionResult PutGeoMaster(int id, GeoMaster geomaster)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != geomaster.Id)
            {
                return BadRequest();
            }

            //convert lat long to geomaster location
            geomaster.Location = DbGeography.FromText("POINT(" + geomaster.Longitude + "  " + geomaster.Latitude + ")");

            db.Entry(geomaster).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GeoMasterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/GeoMaster
        [ResponseType(typeof(GeoMaster))]
        public IHttpActionResult PostGeoMaster(GeoMaster geomaster)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //get week
            var weekId = db.Week.First().Week_Id;

            //set week to geomaster
            geomaster.Week = weekId;

            //get user id and teamname
            var currentUserId = User.Identity.GetUserId();
            var currentTeamName = manager.FindById(currentUserId).TeamName;

            //set TeamName

            if (geomaster.TeamName.Length <= 0)
            {
                geomaster.TeamName = currentTeamName;
            }


            //convert lat long to geomaster location
            geomaster.Location = DbGeography.FromText("POINT(" + geomaster.Longitude + "  " + geomaster.Latitude + ")");

            db.GeoMasters.Add(geomaster);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = geomaster.Id }, geomaster);
        }

        // DELETE api/GeoMaster/5
        [ResponseType(typeof(GeoMaster))]
        public IHttpActionResult DeleteGeoMaster(int id)
        {
            GeoMaster geomaster = db.GeoMasters.Find(id);
            if (geomaster == null)
            {
                return NotFound();
            }

            db.GeoMasters.Remove(geomaster);
            db.SaveChanges();

            return Ok(geomaster);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GeoMasterExists(int id)
        {
            return db.GeoMasters.Count(e => e.Id == id) > 0;
        }
    }
}