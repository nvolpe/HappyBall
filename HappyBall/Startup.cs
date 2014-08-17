using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(HappyBall.Startup))]
namespace HappyBall
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
