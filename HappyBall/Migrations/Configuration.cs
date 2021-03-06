namespace HappyBall.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using HappyBall.Models;
    using System.Data.Entity.Spatial;


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
              new Prop { Id = 1, Bet = "Bet 1", Week = 1, TeamName = "Touchdown Jesus" },
              new Prop { Id = 2, Bet = "Bet 2", Week = 1, TeamName = "Touchdown Jesus" },
              new Prop { Id = 3, Bet = "Bet 3", Week = 1, TeamName = "Touchdown Jesus" }
            );

            context.Kings.AddOrUpdate(
              p => p.Id,
              new King { Id = 1, Pick = "Andrew Luck", Question = "Some question goes here wouldnt you know, gosh i think i fucked up this model", Week = 1, elementId = 1, TeamName = "Touchdown Jesus"},
              new King { Id = 2, Pick = "Michael Vick", Question = "Some question goes here wouldnt you know, gosh i think i fucked up this model", Week = 1, elementId = 2, TeamName = "Touchdown Jesus" },
              new King { Id = 3, Pick = "Lebron James", Question = "Some question goes here wouldnt you know, gosh i think i fucked up this model", Week = 1, elementId = 3, TeamName = "Touchdown Jesus" }
            );

            //context.Results.AddOrUpdate(
            //  p => p.Id,
            //  new Result { Id = 1, TeamName = "team1", PropBet1 = "Bet 1" },
            //  new Result { Id = 2, TeamName = "team2", PropBet2 = "Bet 2" },
            //  new Result { Id = 3, TeamName = "team3", PropBet3 = "Bet 3" }
            //);

            context.Week.AddOrUpdate(
              p => p.Id,
              new Week { Id = 1, Week_Id = 1 }
            );

            var loc = DbGeography.FromText("POINT(" + -105.080056 + "  " + 40.589574 + ")");

            context.GeoMasters.AddOrUpdate(
                p => p.Id,
                new GeoMaster { Id = 1, Week = 1, Location = loc, Latitude = 40.589574, Longitude = -105.080056, TeamName = "Touchdown Jesus", AllottedTime = 15, Question = "Some question goes here" }
            );

            context.Finals.AddOrUpdate(
              p => p.Id,
              new Final { Id = 1, TeamName = "Touchdown Jesus", PropResult = 0, KingResult = 0 },
              new Final { Id = 2, TeamName = "Bob team", PropResult = 0, KingResult = 0 },
              new Final { Id = 3, TeamName = "Dustins Team", PropResult = 0, KingResult = 0 }
            );

            context.KingAnswers.AddOrUpdate(
              p => p.Id,
              new KingAnswer { Id = 1, Week = 1, Answer1 = "mom", Answer2 = "dad", Answer3 = "vern" }
            );


        }
    }
}
