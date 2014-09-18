using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HappyBall.Models
{
    public class KingAnswer
    {
        public int Id { get; set; }
        public int Week { get; set; }
        public string Answer1 { get; set; } //comma delimited string of correct answers
        public string Answer2 { get; set; }
        public string Answer3 { get; set; }

        public KingAnswer()
        {
            //TODO: Get date and lookup to see what Football week is being played
            ApplicationDbContext db = new ApplicationDbContext();
            var weekId = db.Week.First().Week_Id;

            this.Week = weekId;
        }
    }
}