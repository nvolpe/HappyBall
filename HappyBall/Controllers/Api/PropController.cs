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
    public class PropController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET api/Prop
        public IQueryable<Prop> GetProp()
        {
            return db.Prop;
        }

        // GET api/Prop/5
        [ResponseType(typeof(Prop))]
        public IHttpActionResult GetProp(int id)
        {
            Prop prop = db.Prop.Find(id);
            if (prop == null)
            {
                return NotFound();
            }

            return Ok(prop);
        }

        // PUT api/Prop/5
        public IHttpActionResult PutProp(int id, Prop prop)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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