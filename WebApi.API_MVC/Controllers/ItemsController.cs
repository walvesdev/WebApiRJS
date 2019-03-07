using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WebApi.Dados.AcessoDados;
using WebApi.Dados.AcessoDados.Repositorios;
using WebApi.Models.ItemModel;
using WebApi.Services.Services.Filters;

namespace WebApi.API_MVC.Controllers
{
    public class ItemsController : Controller
    {
        private readonly ItemRepositorio context;

        public ItemsController(ItemRepositorio context)
        {
            this.context = context;
        }
        [HttpGet]
        public async Task<IActionResult> Index()
        {

            return View(await context.SelecionarTodosAsync());
        }
        [HttpGet]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var item = await context.dbset.FirstOrDefaultAsync(m => m.ID == id);
            if (item == null)
            {
                return NotFound();
            }

            return View(item);
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
                
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ModelStateValidator]
        public IActionResult Create([Bind("ID,Active,Name,Date,Value")] Item item)
        {           
             context.Inserir(item);
            return  RedirectToAction(nameof(Index));

        }
        [HttpGet]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var item = await context.dbset.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return View(item);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        [ModelStateValidator]
        public IActionResult Edit(int id, [Bind("ID,Active,Name,Date,Value")] Item item)
        {
            if (id != item.ID)
            {
                return NotFound();
            }
            try
            {
                context.Atualizar(item);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(item.ID))
                {
                    return NotFound();
                }               
            }
            return RedirectToAction(nameof(Index));

        }
        [HttpGet]
        public  IActionResult Delete(int id)
        {
            try
            {
                var item = context.SelecionarPorId(id);

                return View(item);
            }
            catch (Exception)
            {
                return NotFound();
            }
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public  IActionResult DeleteConfirmed(int id)
        {
            try
            {
                var item = context.SelecionarPorId(id);
                context.Excluir(item);

                return RedirectToAction(nameof(Index));
            }
            catch (Exception)
            {
                return NotFound();
            }
            
        }

        private bool ItemExists(int id)
        {
            return context.dbset.Any(e => e.ID == id);
        }
    }
}
