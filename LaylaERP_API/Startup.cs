using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(LaylaERP_API.Startup))]

namespace LaylaERP_API
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
