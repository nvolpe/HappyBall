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
    public class AdminController : Controller
    {
        //
        // GET: /Admin/
        public ActionResult Index()
        {

            var manager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new ApplicationDbContext()));

            if (User.Identity.IsAuthenticated)
            {

                var currentUser = manager.FindById(User.Identity.GetUserId());

                ViewBag.SiteRoot = string.Format("{0}://{1}{2}", Request.Url.Scheme, Request.Url.Authority, Url.Content("~"));

                ViewBag.UserName = currentUser.UserName;
                ViewBag.TeamName = currentUser.TeamName;

            }

            return View();
        }
	}
}