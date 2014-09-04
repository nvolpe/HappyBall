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
    public class KingResultController : ApiController
    {
        private UserManager<ApplicationUser> manager;
        private ApplicationDbContext db = new ApplicationDbContext();

        public KingResultController()
        {
            manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }

        // GET api/King
        public IQueryable<KingResult> GetKings()
        {
            return db.KingResults;
        }

        // GET api/King/5
        [ResponseType(typeof(KingResult))]
        [System.Web.Http.Route("api/kingresult/week", Name = "GetKingResultByWeek")]
        public IHttpActionResult GetKingResultByWeek()
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
            var results = db.KingResults.Where(x => x.Week == weekId && x.UserId == userId).FirstOrDefault();


            //TODO: IMPORTANT! Figure out another way to return empty result if query above returns nothing
            //NEED TO FIX. 
            //if (results == null)
            //{
            //    return NotFound();
            //}


            return Ok(results);
        }

        // PUT api/King/5
        public IHttpActionResult PutKing(int id, KingResult king)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != king.Id)
            {
                return BadRequest();
            }

            db.Entry(king).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KingExists(id))
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

        // POST api/King
        [ResponseType(typeof(KingResult))]
        public IHttpActionResult PostKing(KingResult king)
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
            king.TeamName = currentTeamName;
            king.UserId = currentUserId;


            db.KingResults.Add(king);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = king.Id }, king);
        }

        // DELETE api/King/5
        [ResponseType(typeof(KingResult))]
        public IHttpActionResult DeleteKing(int id)
        {
            KingResult king = db.KingResults.Find(id);
            if (king == null)
            {
                return NotFound();
            }

            db.KingResults.Remove(king);
            db.SaveChanges();

            return Ok(king);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool KingExists(int id)
        {
            return db.KingResults.Count(e => e.Id == id) > 0;
        }
    }
}