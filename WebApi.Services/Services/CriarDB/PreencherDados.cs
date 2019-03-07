using System.Collections.Generic;
using System.IO;
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
            banco.InserirLista(items);

        }
       
        public static List<Item> GetItems()
        {
            var json = File.ReadAllText("db.json");

            var items = JsonConvert.DeserializeObject<List<Item>>(json);
            return items;
        }
    }
}
