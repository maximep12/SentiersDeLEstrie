using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Session;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System;

namespace Sentier2._0
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {


            

            services.AddControllers().AddSessionStateTempDataProvider();

            services.AddDistributedMemoryCache();

            services.AddSession();

            services.AddCors(c =>
            {
                // Cette Politique de CORS permet d'etre appeler et d'etre efficace sur le serveur.
                c.AddPolicy("AllowOrigin", options =>
                {
                    options.AllowAnyOrigin();
                    options.AllowAnyMethod();
                    options.AllowAnyHeader();
                });
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v3", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "Documentation du serveur pour les Sentiers de l'Estrie",
                    Version = "v3",
                    Description = "Service construit par les étudiants en Informatique de Gestion de l'université de Sherbrooke au printemps 2021. Pour accèder a l'interface administratif, allez au : http://sentiersest.web810.discountasp.net/"
                });
                c.IgnoreObsoleteActions();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // NE PAS TOUCHER A L'ORDRE DES APPELS, JE VOUS PRIS, C'EST ARRACHANT...
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }



            app.UseHttpsRedirection();

            app.UseSession();

            app.UseRouting();


            // Permet de bloquer les acces directe a index.html
            app.Use((context, next) =>
            {
                if (!context.Request.Path.StartsWithSegments("/index.html"))
                {
                    return next();
                }
                // Don't return a 401 response if the user is already authenticated.
                if (context.Session.GetString("weGood?") == "yes")
                {
                    return next();
                }
                // Stop processing the request and return a 401 response.
                context.Response.StatusCode = 401;
                return Task.FromResult(0);
            });

            app.UseStaticFiles();

            //ajout pour permettre CORS
            app.UseCors(options =>
            {
                options.AllowAnyOrigin();
                options.AllowAnyHeader();
                options.AllowAnyMethod();
            });

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });





            // ajout pour la documentation SwashBuckkle
            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v3/swagger.json", "Test API sentiers v3");
                c.RoutePrefix = "doc";
                // Pour acceder a la documentation: http://sentiersest.web810.discountasp.net/
            });
        }
    }
}
