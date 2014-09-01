using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity.Spatial;

namespace HappyBall.Models
{
    public class GeoResult
    {
        public int Id { get; set; }
        public string TeamName { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double DistanceAway { get; set; }
        public int Week { get; set; }
        public string UserId { get; set; }
        public DbGeography Location { get; set; }


        public GeoResult()
        {
            //TODO: Get date and lookup to see what Football week is being played
            ApplicationDbContext db = new ApplicationDbContext();
            var weekId = db.Week.First().Week_Id;

            this.Week = weekId;
        }


    }
}