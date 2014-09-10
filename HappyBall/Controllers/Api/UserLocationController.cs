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
    public class UserLocationController : ApiController
    {
        private UserManager<ApplicationUser> manager;
        private ApplicationDbContext db = new ApplicationDbContext();

        public UserLocationController()
        {
            manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }

        // GET api/UserLocation
        public IQueryable<UserLocation> GetUserLocations()
        {
            return db.UserLocations;
        }

        // GET api/UserLocation/5
        [ResponseType(typeof(UserLocation))]
        [System.Web.Http.Route("api/userlocation/team", Name = "GetUserLocationByTeam")]
        public IHttpActionResult GetUserLocationByTeam()
        {

            var currentUserId = User.Identity.GetUserId();
            var currentTeamName = manager.FindById(currentUserId).TeamName;


            var result = db.UserLocations.Where(x => x.TeamName == currentTeamName).FirstOrDefault();


            //UserLocation userlocation = db.UserLocations.Find(id);
            //if (userlocation == null)
            //{
            //    return NotFound();
            //}

            return Ok(result);
        }

        // PUT api/UserLocation/5
        public IHttpActionResult PutUserLocation(int id, UserLocation userlocation)
        {
            //get user id and teamname
            var currentUserId = User.Identity.GetUserId();
            var currentTeamName = manager.FindById(currentUserId).TeamName;

            userlocation.TeamName = currentTeamName;


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userlocation.Id)
            {
                return BadRequest();
            }

            db.Entry(userlocation).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserLocationExists(id))
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

        // POST api/UserLocation
        [ResponseType(typeof(UserLocation))]
        public IHttpActionResult PostUserLocation(UserLocation userlocation)
        {
            var currentUserId = User.Identity.GetUserId();
            var currentTeamName = manager.FindById(currentUserId).TeamName;

            userlocation.TeamName = currentTeamName;


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserLocations.Add(userlocation);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userlocation.Id }, userlocation);
        }

        // DELETE api/UserLocation/5
        [ResponseType(typeof(UserLocation))]
        public IHttpActionResult DeleteUserLocation(int id)
        {
            UserLocation userlocation = db.UserLocations.Find(id);
            if (userlocation == null)
            {
                return NotFound();
            }

            db.UserLocations.Remove(userlocation);
            db.SaveChanges();

            return Ok(userlocation);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserLocationExists(int id)
        {
            return db.UserLocations.Count(e => e.Id == id) > 0;
        }
    }
}