using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using HappyBall.Models;


namespace HappyBall.Controllers.Api
{
    public class ResultController : ApiController
    {
        private UserManager<ApplicationUser> manager;
        private ApplicationDbContext db = new ApplicationDbContext();

        public ResultController()
        {
            manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }


        // GET api/Result
        public IQueryable<Result> GetResults()
        {
            return db.Results;
        }

        // GET api/Result/5
        [ResponseType(typeof(Result))]
        [System.Web.Http.Route("api/result/week", Name = "GetResultByWeek")]
        public IHttpActionResult GetResultByWeek()
        {

            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            //Get user ID
            //------------------------------------
            //var currentUser = manager.FindByIdAsync(User.Identity.GetUserId());
            var testUseId = User.Identity.GetUserId();

            //Get Matching Prop Model based off this type of query: where userID == 'abc123' and weekId = 1 
            //------------------------------------
            //TODO: Try and understand this better lol. switch to: .ToList() if we want a collection of results.. i dont understand linq!
            var results = db.Results.Where(x => x.Week == weekId && x.UserId == testUseId).FirstOrDefault();


            //TODO: IMPORTANT! Figure out another way to return empty result if query above returns nothing
            //NEED TO FIX. 
            //if (results == null)
            //{
            //    return NotFound();
            //}
            

            return Ok(results);
        }


        // PUT api/Result/5
        public IHttpActionResult PutResult(int id, Result result)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Entry(result).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ResultExists(id))
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

        //POST api/Result
        [ResponseType(typeof(Result))]
        public IHttpActionResult PostResult(Result result)
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
            result.TeamName = currentTeamName;
            result.UserId = currentUserId;


            db.Results.Add(result);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = result.Id }, result);
            //return CreatedAtRoute("DefaultApi", new { id = result.User.UserInfo.Id }, result);
        }

        // DELETE api/Result/5
        [ResponseType(typeof(Result))]
        public IHttpActionResult DeleteResult(int id)
        {
            Result result = db.Results.Find(id);
            if (result == null)
            {
                return NotFound();
            }

            db.Results.Remove(result);
            db.SaveChanges();

            return Ok(result);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ResultExists(int id)
        {
            return db.Results.Count(e => e.Id == id) > 0;
            //return db.Results.Count(e => e.User.UserInfo.Id == id) > 0;
        }
    }
}