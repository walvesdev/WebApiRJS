using Microsoft.EntityFrameworkCore;
using WebApi.Dados.AcessoDados.TypeConfiguration;
using WebApi.Models.ItemModel;

namespace WebApi.Dados.AcessoDados
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Item> Items { get; set; }


        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {

        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseNpgsql("User Id=postgres;Password=123456;Host=localhost;Port=5432;Database=WebApi");
                       
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("API");
            modelBuilder.ApplyConfiguration(new ItemTypeConfiguration());
        }
    }
}
