using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestSharp;
using RestSharp.Serialization.Json;
using WebApi.Dados.AcessoDados.Repositorios;
using WebApi.Models.ItemModel;

namespace WebApi.API_A.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly ItemRepositorio context;

        public ItemController(ItemRepositorio context)
        {
            this.context = context;
        }

        [HttpGet]
        public ActionResult<List<Item>> Get()
        {
            try
            {
                List<Item> items = context.SelecionarTodos();

                return Ok(items);
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }

        }

        [HttpGet("{id}", Name = "GetItem")]
        public ActionResult<Item> Get(int id)
        {
            try
            {
                Item item = context.SelecionarPorId(id);

                return Ok(item);
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost]
        public ActionResult Post([FromBody]Item item)
        {
            try
            {
                context.Inserir(item);

                return CreatedAtRoute("GetItem", new { id = item.ID }, item);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("{id}")]
        public ActionResult Put([FromRoute]int id, [FromBody]Item item)
        {
            if (item ==null || item.ID != id)
            {
                return BadRequest();
            }
            try
            {
                if (!context.dbset.Where(i => i.ID == id).Any())
                {
                    return NotFound();
                }
                context.Atualizar(item);

                return new NoContentResult();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute]int id)
        {
            if (string.IsNullOrEmpty(id.ToString()))
            {
                return BadRequest();
            }
            try
            {
                var itemBanco = context.SelecionarPorId(id);

                if (itemBanco == null)
                {
                    return NotFound();
                }
                context.Excluir(itemBanco);

                return new NoContentResult();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("/api/rjs")]
        public ActionResult<List<ItemsList>> Rjs()
        {
            try
            {
                RestClient restClient = new RestClient(string.Format("https://www.rjstecnologia.com.br/"));
                RestRequest restRequest = new RestRequest(string.Format("documentos/json-teste.json"), Method.GET);

                IRestResponse restResponse = restClient.Execute(restRequest);

                List<ItemsList> items = new JsonDeserializer().Deserialize<List<ItemsList>>((restResponse));

                return Ok(items);
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }

        }
    }
}
