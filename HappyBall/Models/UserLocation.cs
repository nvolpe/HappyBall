using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HappyBall.Models
{
    public class UserLocation
    {
        public int Id { get; set; }
        public string TeamName { get; set; }
        public string Lat { get; set; }
        public string Lon { get; set; }
        public Boolean Show { get; set; }
    }
}