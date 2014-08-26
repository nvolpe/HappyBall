﻿using System;
using System.Collections.Generic;
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
        public int LogIns { get; set; }
    }
}