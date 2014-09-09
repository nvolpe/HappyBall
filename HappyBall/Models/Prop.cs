using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HappyBall.Models
{
    public class Prop
    {
        public int Id { get; set; }
        public string Bet { get; set; }
        public string TeamName { get; set; }
        public int Week { get; set; }


        public Prop()
        {
            //TODO: Get date and lookup to see what Football week is being played
            ApplicationDbContext db = new ApplicationDbContext();
            var weekId = db.Week.First().Week_Id;
            this.Week = weekId;

        }

    }


}