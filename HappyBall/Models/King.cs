using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HappyBall.Models
{
    public class King
    {
        public int Id { get; set; }
        public int elementId { get; set; } //has to be 1 - whatever
        public string Pick { get; set; }
        public string Question { get; set; }
        public string TeamName { get; set; }
        public int Week { get; set; }

        public King()
        {
            //TODO: Get date and lookup to see what Football week is being played
            ApplicationDbContext db = new ApplicationDbContext();
            var weekId = db.Week.First().Week_Id;

            this.Week = weekId;
        }
    }
}