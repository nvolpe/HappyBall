using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HappyBall.Models
{
    public class Final
    {

        public int Id { get; set; }
        public string TeamName { get; set; }
        public double PropResult { get; set; }
        public double KingResult { get; set; }
        public int Week { get; set; }

        public Final()
        {
            //TODO: Get date and lookup to see what Football week is being played
            ApplicationDbContext db = new ApplicationDbContext();
            var weekId = db.Week.First().Week_Id;

            this.Week = weekId;
        }



    }
}