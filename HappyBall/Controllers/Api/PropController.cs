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

namespace HappyBall.Controllers.Api
{
    public class PropController : ApiController
    {
        private UserManager<ApplicationUser> manager;
        private ApplicationDbContext db = new ApplicationDbContext();

        public PropController()
        {
            manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }


        //GET api/Prop
        public IQueryable<Prop> GetProp()
        {
            return db.Prop;
        }

        //GET api/Prop/5
        [ResponseType(typeof(Prop))]
        [System.Web.Http.Route("api/prop/week", Name = "GetPropByWeek")]
        public IHttpActionResult GetPropByWeek()
        {

            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            var results = db.Prop.Where(x => x.Week == weekId).ToList();


            if (results == null)
            {
                return NotFound();
            }

            return Ok(results);
        }


        // PUT api/Prop/5
        public IHttpActionResult PutProp(int id, Prop prop)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //get week
            var weekId = db.Week.First().Week_Id;

            //set week to geomaster
            prop.Week = weekId;

            //get user id and teamname
            var currentUserId = User.Identity.GetUserId();
            var currentTeamName = manager.FindById(currentUserId).TeamName;

            //set TeamName
            if (prop.TeamName.Length <= 0)
            {
                prop.TeamName = currentTeamName;
            }


            if (id != prop.Id)
            {
                return BadRequest();
            }

            db.Entry(prop).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropExists(id))
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

        // POST api/Prop
        [ResponseType(typeof(Prop))]
        public IHttpActionResult PostProp(Prop prop)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //get week
            var weekId = db.Week.First().Week_Id;

            //set week to geomaster
            prop.Week = weekId;

            //get user id and teamname
            var currentUserId = User.Identity.GetUserId();
            var currentTeamName = manager.FindById(currentUserId).TeamName;

            //set TeamName
            if (prop.TeamName.Length <= 0)
            {
                prop.TeamName = currentTeamName;
            }


            db.Prop.Add(prop);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = prop.Id }, prop);
        }

        // DELETE api/Prop/5
        [ResponseType(typeof(Prop))]
        public IHttpActionResult DeleteProp(int id)
        {
            Prop prop = db.Prop.Find(id);
            if (prop == null)
            {
                return NotFound();
            }

            db.Prop.Remove(prop);
            db.SaveChanges();

            return Ok(prop);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PropExists(int id)
        {
            return db.Prop.Count(e => e.Id == id) > 0;
        }
    }
}