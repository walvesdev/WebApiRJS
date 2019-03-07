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

namespace WebApi.API_MVC.Controllers.API
{
    [Route("apimvc/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly ItemRepositorio context;

        public ItemController(ItemRepositorio context)
        {
            this.context = context;
        }

        [HttpGet]
        public ActionResult<List<ItemsList>> Get()
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

        [HttpGet("{id}")]
        public ActionResult<Item> Get(int id)
        {
            return null;
        }

        [HttpPost]
        public void Post([FromBody] Item cliente)
        {
            
        }

        [HttpPut("{id}")]
        public void Put([FromRoute] int id, [FromBody] Item value)
        {
            
        }

        [HttpDelete("{id}")]
        public void Delete([FromRoute] int id)
        {
            
        }
    }
}
