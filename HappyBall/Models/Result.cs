using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;


namespace HappyBall.Models
{
    public class Result
    {
        public int Id { get; set; }
        public string TeamName { get; set; }
        public string PropBet1 { get; set; }
        public string PropBet2 { get; set; }
        public string PropBet3 { get; set; }
        public decimal Points1 { get; set; }
        public decimal Points2 { get; set; }
        public decimal Points3 { get; set; }
        public decimal WeekTotal { get; set; }
        public int LogIns { get; set; }
        public int Week { get; set; }
        public string UserId { get; set; }
        

        public Result()
        {
            //TODO: Get date and lookup to see what Football week is being played
            ApplicationDbContext db = new ApplicationDbContext();
            var weekId = db.Week.First().Week_Id;

            this.Week = weekId;
        }


        
    }
}