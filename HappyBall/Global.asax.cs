using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Entity;
using System.Web;
using System.Web.Mvc;
using System.Web.Http;
using System.Web.Optimization;
using System.Web.Routing;

namespace HappyBall
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            Database.SetInitializer<HappyBall.Models.ApplicationDbContext>(null);
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
           
            GlobalConfiguration.Configuration.EnsureInitialized();

            // WebApi formatters
            var formatters = GlobalConfiguration.Configuration.Formatters;

            // Remove default XML formatter
            formatters.XmlFormatter.SupportedMediaTypes.Clear();

            // JSON formattings
            var json = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
            json.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
            json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();


            // Fix JSON.NET self referencing hell
            json.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        }
    }
}
