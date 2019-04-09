using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebApi.Dados.AcessoDados;
using WebApi.Dados.AcessoDados.Repositorios;
using WebApi.Models.ItemModel;

namespace WebApi.Services.Services.CriarDB
{
    public class PreencherDados 
    {
        private readonly ItemRepositorio banco;
        private readonly ApplicationContext context;

        public PreencherDados(ApplicationContext context, ItemRepositorio banco)
        {
            this.banco = banco;
            this.context = context;
        }

        public void InicializaDB()
        {
            context.Database.Migrate();
            List<Item> items = GetItems();

            InserirLista(items);

        }
       
        public static List<Item> GetItems()
        {
            var json = File.ReadAllText("db.json");

            var items = JsonConvert.DeserializeObject<List<Item>>(json);
            return items;
        }
        public  void InserirLista(List<Item> Lista)
        {
            foreach (var item in Lista)
            {
                if (!banco.dbset.Where(i => i.ID == item.ID).Any())
                {
                    context.Add(new Item()
                    {
                        Name = item.Name,
                        Active = item.Active,
                        Date = item.Date,
                        Value = item.Value
                    });
                }
                context.SaveChanges();
            }
        }
    }
}
