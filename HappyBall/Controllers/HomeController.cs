using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HappyBall.Models;

namespace HappyBall.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {

            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));

            if (User.Identity.IsAuthenticated) {

                var currentUser = manager.FindById(User.Identity.GetUserId());

                ViewBag.TeamName = currentUser.UserInfo.TeamName;
                ViewBag.UserId = currentUser.UserInfo.Id;
                ViewBag.UserName = currentUser.UserName;
            }

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";


            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}