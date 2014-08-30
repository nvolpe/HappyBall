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
    public class WeekController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET api/Week
        public IQueryable<Week> GetWeek()
        {
            return db.Week;
        }

        // GET api/Week/5
        [ResponseType(typeof(Week))]
        public IHttpActionResult GetWeek(int id)
        {
            Week week = db.Week.Find(id);
            if (week == null)
            {
                return NotFound();
            }

            return Ok(week);
        }

        // PUT api/Week/5
        public IHttpActionResult PutWeek(int id, Week week)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != week.Id)
            {
                return BadRequest();
            }

            db.Entry(week).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WeekExists(id))
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

        // POST api/Week
        [ResponseType(typeof(Week))]
        public IHttpActionResult PostWeek(Week week)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Week.Add(week);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = week.Id }, week);
        }

        // DELETE api/Week/5
        [ResponseType(typeof(Week))]
        public IHttpActionResult DeleteWeek(int id)
        {
            Week week = db.Week.Find(id);
            if (week == null)
            {
                return NotFound();
            }

            db.Week.Remove(week);
            db.SaveChanges();

            return Ok(week);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool WeekExists(int id)
        {
            return db.Week.Count(e => e.Id == id) > 0;
        }
    }
}