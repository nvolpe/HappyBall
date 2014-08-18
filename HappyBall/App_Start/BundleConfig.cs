using System.Web;
using System.Web.Optimization;

namespace HappyBall
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            //------------------------
            // jquery
            //------------------------
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-1.10.2.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*",
                        "~/Scripts/bootstrap-validate.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));


            //------------------------
            // bootstrap and stuff
            //------------------------
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/jquery.navgoco.js",
                      "~/Scripts/respond.js"));

            //------------------------
            // css
            //------------------------
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/offcanvas.css",
                      "~/Content/site.css"));

            //------------------------
            // marionette
            //------------------------
            bundles.Add(new ScriptBundle("~/bundles/marionette").Include(
                    "~/Scripts/Public/marionette/json2.js",
                    "~/Scripts/Public/marionette/underscore.js",
                    "~/Scripts/Public/marionette/backbone.js",
                    "~/Scripts/Public/marionette/backbone.marionette.js"));


            //------------------------
            // backbone extensions
            //------------------------
            bundles.Add(new ScriptBundle("~/bundles/backbone-extensions").Include(
                    "~/Scripts/Public/backbone-libs/backbone-extensions.js"
                    ));

            //------------------------
            // utlities
            //------------------------
            bundles.Add(new ScriptBundle("~/bundles/utilities").Include(
                "~/Scripts/Public/vendor/ladda-bootstrap/spin.js",
                "~/Scripts/Public/vendor/ladda-bootstrap/ladda.js",
                "~/Scripts/Public/utils/ffa.namespace.js",
                "~/Scripts/Public/utils/String.js",
                "~/Scripts/Public/utils/StringBuilder.js",
                "~/Scripts/Public/utils/utils.js"
                ));


            //------------------------
            // Author: Nick V
            //------------------------
            bundles.Add(new ScriptBundle("~/bundles/happyBall").Include(
                "~/Scripts/Public/app.js",
                "~/Scripts/Public/happyBall/modules/propModule.js",
                "~/Scripts/Public/happyBall/views/propView.js"
                ));

        }
    }
}
