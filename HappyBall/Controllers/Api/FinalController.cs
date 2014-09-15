//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.Entity;
//using System.Data.Entity.Infrastructure;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Web.Http;
//using System.Web.Http.Description;
//using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;
//using HappyBall.Models;

//namespace HappyBall.Controllers.Api
//{
//    public class FinalController : ApiController
//    {
//        private ApplicationDbContext db = new ApplicationDbContext();

//        // GET api/Final
//        public IQueryable<Final> GetFinals()
//        {
//            return db.Finals;
//        }


//        //GET api/Prop/5
//        [ResponseType(typeof(Final))]
//        [System.Web.Http.Route("api/Final/week", Name = "CalculateProps")]
//        public IHttpActionResult CalculateProps()
//        {

//            //Get Current Week?
//            //------------------------------------
//            var weekId = db.Week.First().Week_Id;


//            //Go get the right answers
//            var answer1 = db.Prop.Where(x => x.Week == weekId && x.Id == 1).FirstOrDefault().Answer;
//            var answer2 = db.Prop.Where(x => x.Week == weekId && x.Id == 2).FirstOrDefault().Answer;
//            var answer3 = db.Prop.Where(x => x.Week == weekId && x.Id == 3).FirstOrDefault().Answer;

//            //Go get how many people answered the right question
//            var answer1count = db.Results.Where(x => x.PropBet1 == answer1).Count();
//            var answer2count = db.Results.Where(x => x.PropBet1 == answer2).Count();
//            var answer3count = db.Results.Where(x => x.PropBet1 == answer3).Count();

//            //Take the total count for the answer / 100

//            double answer1Points = 100;
//            double answer2Points = 100;
//            double answer3Points = 100;
 

//            if (answer1count > 0) { answer1Points = 100 / answer1count; }
//            if (answer2count > 0) { answer2Points = 100 / answer2count; }
//            if (answer3count > 0) { answer3Points = 100 / answer3count; }
            

//            //Todo, iterate over each team in the results and see if they answered the right question, if so give them the amount of points
//            //var allResults = db.Results.ToList();

//            var correctTeamsForAnswer1 = db.Results.Where(x => x.PropBet1 == answer1).ToList();
//            var correctTeamsForAnswer2 = db.Results.Where(x => x.PropBet2 == answer2).ToList();
//            var correctTeamsForAnswer3 = db.Results.Where(x => x.PropBet3 == answer3).ToList();

//            correctTeamsForAnswer1.ForEach(x => x.Points1 = answer1Points);
//            correctTeamsForAnswer2.ForEach(x => x.Points2 = answer2Points);
//            correctTeamsForAnswer3.ForEach(x => x.Points3 = answer3Points);

//            db.Results.ToList().ForEach(x => x.WeekTotal = x.Points1 + x.Points2 + x.Points3);





//            //var allResults = db.Results.ToList().ForEach(x => x.PropBet1 == answer1
//            //var allResults = db.Results.ToList().ForEach(x => x.PropBet1 == 
//            //allResults.ForEach(x => SetTeam(x.TeamName, answer1Points, answer2Points, answer3Points));



//            //if (results == null)
//            //{
//            //    return NotFound();
//            //}

//            //return Ok(results);
//        }

//        private static void SetTeam(string teamName, double answer1Points, double answer2Points, double answer3Points)
//        {
//            //Final final = null;

//           var test = db.Results.wh



//        }

//        // GET api/Final/5
//        //[ResponseType(typeof(Final))]
//        //public IHttpActionResult GetFinal(int id)
//        //{
//        //    Final final = db.Finals.Find(id);
//        //    if (final == null)
//        //    {
//        //        return NotFound();
//        //    }

//        //    return Ok(final);
//        //}

//        //// PUT api/Final/5
//        //public IHttpActionResult PutFinal(int id, Final final)
//        //{
//        //    if (!ModelState.IsValid)
//        //    {
//        //        return BadRequest(ModelState);
//        //    }

//        //    if (id != final.Id)
//        //    {
//        //        return BadRequest();
//        //    }

//        //    db.Entry(final).State = EntityState.Modified;

//        //    try
//        //    {
//        //        db.SaveChanges();
//        //    }
//        //    catch (DbUpdateConcurrencyException)
//        //    {
//        //        if (!FinalExists(id))
//        //        {
//        //            return NotFound();
//        //        }
//        //        else
//        //        {
//        //            throw;
//        //        }
//        //    }

//        //    return StatusCode(HttpStatusCode.NoContent);
//        //}

//        //// POST api/Final
//        //[ResponseType(typeof(Final))]
//        //public IHttpActionResult PostFinal(Final final)
//        //{
//        //    if (!ModelState.IsValid)
//        //    {
//        //        return BadRequest(ModelState);
//        //    }

//        //    db.Finals.Add(final);
//        //    db.SaveChanges();

//        //    return CreatedAtRoute("DefaultApi", new { id = final.Id }, final);
//        //}

//        //// DELETE api/Final/5
//        //[ResponseType(typeof(Final))]
//        //public IHttpActionResult DeleteFinal(int id)
//        //{
//        //    Final final = db.Finals.Find(id);
//        //    if (final == null)
//        //    {
//        //        return NotFound();
//        //    }

//        //    db.Finals.Remove(final);
//        //    db.SaveChanges();

//        //    return Ok(final);
//        //}

//        //protected override void Dispose(bool disposing)
//        //{
//        //    if (disposing)
//        //    {
//        //        db.Dispose();
//        //    }
//        //    base.Dispose(disposing);
//        //}

//        //private bool FinalExists(int id)
//        //{
//        //    return db.Finals.Count(e => e.Id == id) > 0;
//        //}
//    }
//}