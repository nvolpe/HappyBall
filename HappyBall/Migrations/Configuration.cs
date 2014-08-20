namespace HappyBall.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using HappyBall.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<HappyBall.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            ContextKey = "HappyBall.Models.ApplicationDbContext";
        }

        protected override void Seed(HappyBall.Models.ApplicationDbContext context)
        {
            context.Prop.AddOrUpdate(
              p => p.Id,
              new Prop { Id = 1, Bet = "Bet 1" },
              new Prop { Id = 2, Bet = "Bet 2" },
              new Prop { Id = 3, Bet = "Bet 3" }
            );
        }
    }
}
