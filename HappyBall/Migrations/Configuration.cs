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

            context.Results.AddOrUpdate(
              p => p.Id,
              new Result { Id = 1, TeamName = "team1", PropBet1 = "Bet 1" },
              new Result { Id = 2, TeamName = "team2", PropBet2 = "Bet 2" },
              new Result { Id = 3, TeamName = "team3", PropBet3 = "Bet 3" }
            );

        }
    }
}
