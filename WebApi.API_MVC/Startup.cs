using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WebApi.Dados.AcessoDados;
using WebApi.Dados.AcessoDados.Repositorios;
using WebApi.Models.ItemModel;
using WebApi.Services.Services.Validations;

namespace WebApi.API_MVC
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            string connectionSrting = Configuration.GetConnectionString("ApplicationContext");
            services.AddDbContext<ApplicationContext>((optBuilder) => { optBuilder.UseSqlServer(connectionSrting); });
            services.AddTransient<ItemRepositorio>();
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });


            services.AddMvc();//.AddFluentValidation();
           // services.AddTransient<IValidator<Item>, ItemValidator>();
            
            /*.SetCompatibilityVersion(CompatibilityVersion.Version_2_2);*/
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseCors(option => option
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());

            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            //app.UseCookiePolicy();

            app.UseMvc(routes =>
            {
                routes.MapRoute(name: "default", template: "{controller=Items}/{action=Index}/{id?}");
                //routes.MapRoute(name: "api", template: "api/{controller}/{id?}");
            });
        }
    }
}
