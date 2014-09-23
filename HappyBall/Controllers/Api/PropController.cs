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

        [System.Web.Http.Route("api/prop/calculate", Name = "CalculatePropsForWeek")]
        public IHttpActionResult CalculatePropsForWeek()
        {

            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            //reset back down to 0 first, because i dont want to have multiple clicks fuck things
            var resultsList = db.Results.Where(x => x.Week == weekId).ToList();
            resultsList.ForEach(x => { x.Points1 = 0; x.Points2 = 0; x.Points3 = 0; x.WeekTotal = 0; });


            //Go get the right answers
            var answer1 = db.Prop.Where(x => x.Week == weekId && x.Id == 1).FirstOrDefault().Answer;
            var answer2 = db.Prop.Where(x => x.Week == weekId && x.Id == 2).FirstOrDefault().Answer;
            var answer3 = db.Prop.Where(x => x.Week == weekId && x.Id == 3).FirstOrDefault().Answer;

            //Go get how many people answered the right question
            var answer1count = db.Results.Where(x => x.PropBet1 == answer1).Count();
            var answer2count = db.Results.Where(x => x.PropBet2 == answer2).Count();
            var answer3count = db.Results.Where(x => x.PropBet3 == answer3).Count();

            //Take the total count for the answer / 100
            decimal answer1Points = 100;
            decimal answer2Points = 100;
            decimal answer3Points = 100;

            if (answer1count > 0) { answer1Points = 100 / answer1count; }
            if (answer2count > 0) { answer2Points = 100 / answer2count; }
            if (answer3count > 0) { answer3Points = 100 / answer3count; }

            //Todo, iterate over each team in the results and see if they answered the right question, if so give them the amount of points
            var correctTeamsForAnswer1 = db.Results.Where(x => x.PropBet1 == answer1).ToList();
            var correctTeamsForAnswer2 = db.Results.Where(x => x.PropBet2 == answer2).ToList();
            var correctTeamsForAnswer3 = db.Results.Where(x => x.PropBet3 == answer3).ToList();

            correctTeamsForAnswer1.ForEach(x => x.Points1 = answer1Points);
            correctTeamsForAnswer2.ForEach(x => x.Points2 = answer2Points);
            correctTeamsForAnswer3.ForEach(x => x.Points3 = answer3Points);

            db.Results.ToList().ForEach(x => x.WeekTotal = x.Points1 + x.Points2 + x.Points3);

            //save it first so we can access it next
            db.SaveChanges();

            //ok so now get all the current results so we can add it to the FINAL class to display an ongoing list of leaders to the users client side
            var resultsForFinals = db.Results.ToList();

            //for each prop result, get weekly total and add it to the fucking FINAL class
            resultsForFinals.ForEach(x =>
            {

                var finalItem = db.Finals.Where(y => y.TeamName == x.TeamName).FirstOrDefault();
                var finalProp = db.Finals.Where(y => y.TeamName == x.TeamName).FirstOrDefault().PropResult;
                var totalProp = finalProp + x.WeekTotal;
                finalItem.PropResult = totalProp;

            });

            //save it again
            db.SaveChanges();


            //var finalResults = db.Finals.ToList();
            //finalResults.ForEach(x => x.);

            //var resultsForFinals = db.Results.ToList();
            //List<Final> finalList = new List<Final>();
            //resultsForFinals.ForEach(x => {
            //    finalList.Add(new Final() 
            //    { 
            //        TeamName = x.TeamName,
            //        Week = x.Week,
            //        PropResult = x.WeekTotal
            //    });
            //});


            return Ok("Success yo");
        }






        //private void CreateRecord()
        //{
        //    var test = "test";
        //}



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
            if (prop.TeamName == null)
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