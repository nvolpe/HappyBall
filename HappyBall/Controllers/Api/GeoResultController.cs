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
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using HappyBall.Models;
using System.Data.Entity.Spatial;

namespace HappyBall.Controllers.Api
{
    public class GeoResultController : ApiController
    {
        private UserManager<ApplicationUser> manager;
        private ApplicationDbContext db = new ApplicationDbContext();


        public GeoResultController()
        {
            manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }



        // GET api/GeoResult
        public IQueryable<GeoResult> GetGeoResults()
        {
            return db.GeoResults;
        }

        // GET api/GeoResult/5
        [ResponseType(typeof(GeoResult))]
        [System.Web.Http.Route("api/georesult/week", Name = "GetGeoResultByWeek")]
        public IHttpActionResult GetGeoResultByWeek()
        {

            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            //Get user ID
            //------------------------------------
            //var currentUser = manager.FindByIdAsync(User.Identity.GetUserId());
            var userId = User.Identity.GetUserId();

            //Get Matching Prop Model based off this type of query: where userID == 'abc123' and weekId = 1 
            //------------------------------------
            //TODO: Try and understand this better lol. switch to: .ToList() if we want a collection of results.. i dont understand linq!
            var georesult = db.GeoResults.Where(x => x.Week == weekId && x.UserId == userId).FirstOrDefault();


            //GeoResult georesult = db.GeoResults.Find(id);

            //if (georesult == null)
            //{
            //    return NotFound();
            //}

            return Ok(georesult);
        }

        // PUT api/GeoResult/5
        public IHttpActionResult PutGeoResult(int id, GeoResult georesult)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != georesult.Id)
            {
                return BadRequest();
            }

            db.Entry(georesult).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GeoResultExists(id))
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

        // POST api/GeoResult
        [ResponseType(typeof(GeoResult))]
        public IHttpActionResult PostGeoResult(GeoResult georesult)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //Get user ID
            //------------------------------------
            var currentUserId = User.Identity.GetUserId();
            var currentTeamName = manager.FindById(currentUserId).TeamName;

            //Set user information so we dont have to send it from javascript. Seems like a hacker could hack the guid being sent through ajax.
            //------------------------------------
            georesult.TeamName = currentTeamName;
            georesult.UserId = currentUserId;

            georesult.Location = DbGeography.FromText("POINT(" + georesult.Longitude + "  " + georesult.Latitude + ")");

            //Get Current Week
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            //Get GeoMaster by week
            //----------------------
            var geoMasters = db.GeoMasters.Where(x => x.Week == weekId).FirstOrDefault();

            //Get distance between the posted users bullshit guess, and then the real answer
            //----------------------
            var distance = georesult.Location.Distance(geoMasters.Location);

            //Add the distance to the geoResult model
            //----------------------

            db.GeoResults.Add(georesult);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = georesult.Id }, georesult);
        }

        // DELETE api/GeoResult/5
        [ResponseType(typeof(GeoResult))]
        public IHttpActionResult DeleteGeoResult(int id)
        {
            GeoResult georesult = db.GeoResults.Find(id);
            if (georesult == null)
            {
                return NotFound();
            }

            db.GeoResults.Remove(georesult);
            db.SaveChanges();

            return Ok(georesult);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GeoResultExists(int id)
        {
            return db.GeoResults.Count(e => e.Id == id) > 0;
        }

    }
}