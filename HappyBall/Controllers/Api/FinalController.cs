﻿using System;
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
    public class FinalController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET api/Final
        public IQueryable<Final> GetFinals()
        {
            return db.Finals;
        }


        [ResponseType(typeof(Final))]
        [System.Web.Http.Route("api/final/calculate", Name = "CalculateFinalResults")]
        public IHttpActionResult CalculateFinalResults()
        {
            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            //for each already existing item in finals table, we need to create more rows for the next week
            var previousWeek = weekId - 1;

            var FinalsForAddtionalRows = db.Finals.Where(x => x.Week == previousWeek).ToList();

            FinalsForAddtionalRows.ForEach(x =>
            {
                Final newFinalRow = new Final();
                //newFinalRow.Week = weekId;
                newFinalRow.PropResult = 0.00M;
                newFinalRow.KingResult = 0.00M;
                newFinalRow.WeekTotal = 0.00M;
                newFinalRow.TeamName = x.TeamName;
                newFinalRow.YearTotal = x.YearTotal;

                db.Finals.Add(newFinalRow);
            });

            db.SaveChanges();

            ///////////////////////////////////////////////////////////////////////////////////
            // Calculate Prop Results
            ///////////////////////////////////////////////////////////////////////////////////

            //reset back down to 0 first, because i dont want to have multiple clicks fuck things
            var resultsList = db.Results.Where(x => x.Week == weekId).ToList();
            resultsList.ForEach(x => { x.Points1 = 0; x.Points2 = 0; x.Points3 = 0; x.WeekTotal = 0; });


            //Go get the right answers INDEXEES ARE FUCKED FIX ON DB
            var answer1 = db.Prop.Where(x => x.Week == weekId && x.Id == 1).FirstOrDefault().Answer;
            var answer2 = db.Prop.Where(x => x.Week == weekId && x.Id == 2).FirstOrDefault().Answer;
            var answer3 = db.Prop.Where(x => x.Week == weekId && x.Id == 3).FirstOrDefault().Answer;

            //Go get how many people answered the right question
            var answer1count = db.Results.Where(x => x.PropBet1 == answer1 && x.Week == weekId).Count();
            var answer2count = db.Results.Where(x => x.PropBet2 == answer2 && x.Week == weekId).Count();
            var answer3count = db.Results.Where(x => x.PropBet3 == answer3 && x.Week == weekId).Count();

            //Take the total count for the answer / 100
            decimal answer1Points = 100.00M;
            decimal answer2Points = 100.00M;
            decimal answer3Points = 100.00M;

            if (answer1count > 0) { answer1Points = decimal.Divide(100.00M, answer1count); }
            if (answer2count > 0) { answer2Points = decimal.Divide(100.00M, answer2count); }
            if (answer3count > 0) { answer3Points = decimal.Divide(100.00M, answer3count); }

            //Todo, iterate over each team in the results and see if they answered the right question, if so give them the amount of points
            var correctTeamsForAnswer1 = db.Results.Where(x => x.PropBet1 == answer1 && x.Week == weekId).ToList();
            var correctTeamsForAnswer2 = db.Results.Where(x => x.PropBet2 == answer2 && x.Week == weekId).ToList();
            var correctTeamsForAnswer3 = db.Results.Where(x => x.PropBet3 == answer3 && x.Week == weekId).ToList();

            correctTeamsForAnswer1.ForEach(x => x.Points1 = answer1Points);
            correctTeamsForAnswer2.ForEach(x => x.Points2 = answer2Points);
            correctTeamsForAnswer3.ForEach(x => x.Points3 = answer3Points);

            var resultsToEdit = db.Results.Where(x => x.Week == weekId).ToList();
            resultsToEdit.ForEach(x => x.WeekTotal = x.Points1 + x.Points2 + x.Points3);

            //save it first so we can access it next
            db.SaveChanges();


            ///////////////////////////////////////////////////////////////////////////////////
            // Calculate King Results
            ///////////////////////////////////////////////////////////////////////////////////

            //Go get the right answers
            //var answerItem = db.KingAnswers.Where(x => x.Week == weekId).FirstOrDefault();
            var answerItem = db.KingAnswers.FirstOrDefault();

            //get the right answers from the db
            var kingAnswer1 = answerItem.Answer1;
            var kingAnswer2 = answerItem.Answer2;
            var kingAnswer3 = answerItem.Answer3;

            //store answers in a list for a .contains where lookup, any other way to do this?
            List<string> answersList = new List<string>();
            answersList.Add(kingAnswer1);
            answersList.Add(kingAnswer2);
            answersList.Add(kingAnswer3);

            //how many people got the right answers
            var answerCount1 = db.KingResults.Where(x => answersList.Contains(x.Pick1) && x.Week == weekId).Count();
            var answerCount2 = db.KingResults.Where(x => answersList.Contains(x.Pick2) && x.Week == weekId).Count();
            var answerCount3 = db.KingResults.Where(x => answersList.Contains(x.Pick3) && x.Week == weekId).Count();

            var correctTeams = db.KingResults.Where(x =>
                answersList.Contains(x.Pick1) &&
                answersList.Contains(x.Pick2) &&
                answersList.Contains(x.Pick3) &&
                x.Week == weekId).ToList();

            var correctTeamCount = db.KingResults.Where(x =>
                answersList.Contains(x.Pick1) &&
                answersList.Contains(x.Pick2) &&
                answersList.Contains(x.Pick3) &&
                x.Week == weekId).Count();

            //Kings is worth 200
            decimal kingPoints = 200.00M;
            if (correctTeamCount > 0) { kingPoints = 200.00M / correctTeamCount; }

            correctTeams.ForEach(x => x.WeekTotal = kingPoints);

            //save the database
            db.SaveChanges();

            ///////////////////////////////////////////////////////////////////////////////////
            // Calculate Final On-going Results
            ///////////////////////////////////////////////////////////////////////////////////

            //props
            var resultsForFinals = db.Results.Where(x => x.Week == weekId).ToList();

            var finalsCached = db.Finals.Where(x => x.Week == weekId).ToList();

            //for each prop result, get weekly total and add it to the fucking FINAL class
            resultsForFinals.ForEach(x =>
            {
                var finalItem = finalsCached.Where(y => y.TeamName == x.TeamName).First();
                finalItem.PropResult = x.WeekTotal;
            });

            //kings
            var kingsList = db.KingResults.Where(x => x.Week == weekId).ToList();

            kingsList.ForEach(x =>
            {
                var finalItem = finalsCached.Where(y => y.TeamName == x.TeamName).First();
                finalItem.KingResult = x.WeekTotal;
            });

            //save
            db.SaveChanges();

            //then do it again and save to the ongoing total
            var finalsList = db.Finals.Where(x => x.Week == weekId).ToList();

            finalsList.ForEach(x =>
            {
                x.WeekTotal = x.KingResult + x.PropResult;
            });

            db.SaveChanges();

            finalsList.ForEach(x =>
            {
                x.YearTotal = x.YearTotal + x.WeekTotal;
            });

            db.SaveChanges();


            return Ok("Success yo");
        }


        // GET result by week
        [ResponseType(typeof(Final))]
        [System.Web.Http.Route("api/final/week", Name = "GetFinalByWeek")]
        public IHttpActionResult GetResultByWeek()
        {

            //Get Current Week?
            //------------------------------------
            var weekId = db.Week.First().Week_Id;

            var results = db.Finals.Where(x => x.Week == weekId).ToList();


            return Ok(results);
        }



        // GET result by week
        [ResponseType(typeof(Final))]
        [System.Web.Http.Route("api/final/year", Name = "GetFinalByYear")]
        public IHttpActionResult GetFinalByYear()
        {
            var results = db.Finals.GroupBy(x => x.TeamName).ToList();

            List<YearFinal> finalYearList = new List<YearFinal>();

            //for each prop result, get weekly total and add it to the fucking FINAL class
            results.ForEach(x =>
            {
                YearFinal finalYear = new YearFinal();
                List<decimal> finalList = new List<decimal>();
                var finalItems = x.ToList();

                finalItems.ForEach(y =>
                        {
                            finalList.Add(y.YearTotal);
                        }
                    );

                finalYear.name = x.Key;
                finalYear.data = finalList;
                finalYearList.Add(finalYear);

            });

            return Ok(finalYearList);
        }


        // GET api/Final/5
        //[ResponseType(typeof(Final))]
        //public IHttpActionResult GetFinal(int id)
        //{
        //    Final final = db.Finals.Find(id);
        //    if (final == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(final);
        //}

        //// PUT api/Final/5
        //public IHttpActionResult PutFinal(int id, Final final)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != final.Id)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(final).State = EntityState.Modified;

        //    try
        //    {
        //        db.SaveChanges();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!FinalExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        //// POST api/Final
        //[ResponseType(typeof(Final))]
        //public IHttpActionResult PostFinal(Final final)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Finals.Add(final);
        //    db.SaveChanges();

        //    return CreatedAtRoute("DefaultApi", new { id = final.Id }, final);
        //}

        //// DELETE api/Final/5
        //[ResponseType(typeof(Final))]
        //public IHttpActionResult DeleteFinal(int id)
        //{
        //    Final final = db.Finals.Find(id);
        //    if (final == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Finals.Remove(final);
        //    db.SaveChanges();

        //    return Ok(final);
        //}

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        db.Dispose();
        //    }
        //    base.Dispose(disposing);
        //}

        //private bool FinalExists(int id)
        //{
        //    return db.Finals.Count(e => e.Id == id) > 0;
        //}
    }
}