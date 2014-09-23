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
    public class KingController : ApiController
    {
        private UserManager<ApplicationUser> manager;
        private ApplicationDbContext db = new ApplicationDbContext();

        public KingController()
        {
            manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
        }

        // GET api/King
        public IQueryable<King> GetKings()
        {
            return db.Kings;
        }

        // GET api/King/5
        [ResponseType(typeof(King))]
        [System.Web.Http.Route("api/king/week", Name = "GetKingByWeek")]
        public IHttpActionResult GetKingByWeek()
        {

            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            var results = db.Kings.Where(x => x.Week == weekId).ToList();

            if (results == null)
            {
                return NotFound();
            }

            return Ok(results);
        }


        //TODO FINISH THIS SHIT ONCE I KNOW HOW KINGS WILL LOOK
        [System.Web.Http.Route("api/king/calculate", Name = "CalculateKingsForWeek")]
        public IHttpActionResult CalculateKingsForWeek()
        {

            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            //Go get the right answers
            var answerItem = db.KingAnswers.Where(x => x.Week == weekId).FirstOrDefault();

            //get the right answers from the db
            var answer1 = answerItem.Answer1;
            var answer2 = answerItem.Answer2;
            var answer3 = answerItem.Answer3;

            //store answers in a list for a .contains where lookup, any other way to do this?
            List<string> answersList = new List<string>();
            answersList.Add(answer1);
            answersList.Add(answer2);
            answersList.Add(answer3);

            //how many people got the right answers
            var answerCount1 = db.KingResults.Where(x => answersList.Contains(x.Pick1) && x.Week == weekId).Count();
            var answerCount2 = db.KingResults.Where(x => answersList.Contains(x.Pick2) && x.Week == weekId).Count();
            var answerCount3 = db.KingResults.Where(x => answersList.Contains(x.Pick3) && x.Week == weekId).Count();

            var correctTeams = db.KingResults.Where(x =>
                answersList.Contains(x.Pick1) &&
                answersList.Contains(x.Pick2) &&
                answersList.Contains(x.Pick3) &&
                x.Week == weekId).ToList();

            //TODO: if nobody got the answer right, check if people got 2 of the 3 right. PLAN B for now!
            //if (correctTeams.Count <= 0)
            //{
                //var test = db.KingResults.Where(x => x.Week == weekId).FirstOrDefault();
                //correctTeams = db.KingResults.Where(x =>
                //    answersList.Contains(x.Pick1) &&
                //    answersList.Contains(x.Pick2) &&
                //    answersList.Contains(x.Pick3) &&
                //    x.Week == weekId).ToList();
            //}


            //Kings is worth 200
            decimal kingPoints = 200;

            correctTeams.ForEach(x => x.WeekTotal = kingPoints);



            return Ok("Success yo");
        }


        // PUT api/King/5
        public IHttpActionResult PutKing(int id, King king)
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
        [ResponseType(typeof(King))]
        public IHttpActionResult PostKing(King king)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //get week
            var weekId = db.Week.First().Week_Id;

            //set week to geomaster
            king.Week = weekId;

            //get user id and teamname
            var currentUserId = User.Identity.GetUserId();
            var currentTeamName = manager.FindById(currentUserId).TeamName;

            //set TeamName
            if (king.TeamName.Length <= 0)
            {
                king.TeamName = currentTeamName;
            }

            db.Kings.Add(king);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = king.Id }, king);
        }

        // DELETE api/King/5
        [ResponseType(typeof(King))]
        [System.Web.Http.Route("api/king/deleteweek", Name = "DeleteKingByWeek")]
        public IHttpActionResult DeleteKingByWeek()
        {
            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            var results = db.Kings.Where(x => x.Week == weekId).ToList();


            db.Kings.RemoveRange(results);

            db.SaveChanges();

            return Ok(results);
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
            return db.Kings.Count(e => e.Id == id) > 0;
        }
    }
}