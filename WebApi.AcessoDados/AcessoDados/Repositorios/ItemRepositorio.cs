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
        
    }
}
