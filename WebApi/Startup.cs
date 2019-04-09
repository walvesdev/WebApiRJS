using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WebApi.Dados.AcessoDados;
using WebApi.Dados.AcessoDados.Repositorios;
using WebApi.Services.Services.CriarDB;

namespace WebApi.API_A
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
            services.AddTransient<PreencherDados>();


            services.AddCors();
            services.AddMvc();
        }
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(option => option
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());

            app.UseMvc(routes =>
            {
                routes.MapRoute(name: "api", template: "api/{controller}/{action?}/{id?}");
            });

            serviceProvider.GetService<PreencherDados>().InicializaDB();
        }

    }
}
