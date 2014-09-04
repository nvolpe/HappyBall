using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HappyBall.Models
{
    public class KingResult
    {
        public int Id { get; set; }
        public string TeamName { get; set; }
        public string Pick1 { get; set; }
        public string Pick2 { get; set; }
        public string Pick3 { get; set; }
        public int Week { get; set; }
        public string UserId { get; set; }

        public KingResult()
        {
            //TODO: Get date and lookup to see what Football week is being played
            ApplicationDbContext db = new ApplicationDbContext();
            var weekId = db.Week.First().Week_Id;

            this.Week = weekId;
        }

    }
}