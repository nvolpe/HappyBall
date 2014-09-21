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

namespace HappyBall.Controllers.Api
{
    public class KingAnswerController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET api/KingAnswer
        public IQueryable<KingAnswer> GetKingAnswers()
        {
            return db.KingAnswers;
        }

        // GET api/KingAnswer/5
        [ResponseType(typeof(KingAnswer))]
        public IHttpActionResult GetKingAnswer(int id)
        {
            KingAnswer kinganswer = db.KingAnswers.Find(id);
            if (kinganswer == null)
            {
                return NotFound();
            }

            return Ok(kinganswer);
        }

        // PUT api/KingAnswer/5
        public IHttpActionResult PutKingAnswer(int id, KingAnswer kinganswer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }


            //get week
            var weekId = db.Week.First().Week_Id;

            //set week to geomaster
            kinganswer.Week = weekId;


            if (id != kinganswer.Id)
            {
                return BadRequest();
            }

            db.Entry(kinganswer).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!KingAnswerExists(id))
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

        // POST api/KingAnswer
        [ResponseType(typeof(KingAnswer))]
        public IHttpActionResult PostKingAnswer(KingAnswer kinganswer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.KingAnswers.Add(kinganswer);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = kinganswer.Id }, kinganswer);
        }

        // DELETE api/KingAnswer/5
        [ResponseType(typeof(KingAnswer))]
        public IHttpActionResult DeleteKingAnswer(int id)
        {
            KingAnswer kinganswer = db.KingAnswers.Find(id);
            if (kinganswer == null)
            {
                return NotFound();
            }

            db.KingAnswers.Remove(kinganswer);
            db.SaveChanges();

            return Ok(kinganswer);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool KingAnswerExists(int id)
        {
            return db.KingAnswers.Count(e => e.Id == id) > 0;
        }
    }
}