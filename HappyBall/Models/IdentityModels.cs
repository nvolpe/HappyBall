using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;


namespace HappyBall.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public string TeamName { get; set; }

        //public virtual UserInfo UserInfo { get; set; }

        //public virtual ICollection<Result> Results { get; set; }
    }

    //public class UserInfo
    //{
    //    public int Id { get; set; }
    //    public string TeamName { get; set; }
    //}

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection")
        {
        }

        public System.Data.Entity.DbSet<HappyBall.Models.Prop> Prop { get; set; }
        public System.Data.Entity.DbSet<HappyBall.Models.Result> Results { get; set; }
        public System.Data.Entity.DbSet<HappyBall.Models.Week> Week { get; set; }
    }
}