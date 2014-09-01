using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity.Spatial;

namespace HappyBall.Models
{
    public class GeoMaster
    {
        public int Id { get; set; }
        public int Week { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string TeamName { get; set; }
        public string Question { get; set; }
        public DbGeography Location { get; set; }


        public GeoMaster()
        {
            //TODO: Get date and lookup to see what Football week is being played
            ApplicationDbContext db = new ApplicationDbContext();
            var weekId = db.Week.First().Week_Id;
            this.Week = weekId;

            //this.Location = DbGeography.FromText("POINT(" + -105.080056 + "  " + 40.589574 + ")");

        }
    }
}