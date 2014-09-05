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
using HappyBall.Models;

namespace HappyBall.Controllers.Api
{
    public class KingController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

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

            db.Kings.Add(king);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = king.Id }, king);
        }

        // DELETE api/King/5
        [ResponseType(typeof(King))]
        public IHttpActionResult DeleteKing(int id)
        {
            King king = db.Kings.Find(id);
            if (king == null)
            {
                return NotFound();
            }

            db.Kings.Remove(king);
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
            return db.Kings.Count(e => e.Id == id) > 0;
        }
    }
}