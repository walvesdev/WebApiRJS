using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models.ItemModel;

namespace WebApi.Dados.AcessoDados.Repositorios
{
    public class ItemRepositorio : Repositorio<Item, int>
    {
        public ItemRepositorio(ApplicationContext context) : base(context)
        {
        }
        public void InserirLista(List<Item> Lista)
        {
            foreach (var item in Lista)
            {
                if (!context.Items.Where(p => p.ID == item.ID).Any())
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
