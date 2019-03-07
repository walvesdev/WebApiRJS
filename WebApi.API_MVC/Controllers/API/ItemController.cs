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
                RestClient restClient = new RestClient(string.Format("http://localhost:5000/api/"));
                RestRequest restRequest = new RestRequest(string.Format("item"), Method.GET);
                IRestResponse restResponse = restClient.Execute(restRequest);
                List<Item> items = new JsonDeserializer().Deserialize<List<Item>>((restResponse));

                return Ok(items);
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }

        }

        [HttpGet("{id}", Name = "GetById")]
        public ActionResult<Item> Get(int id)
        {
            try
            {
                RestClient restClient = new RestClient(string.Format("http://localhost:5000/api/"));
                RestRequest restRequest = new RestRequest(string.Format("item/{0}",id), Method.GET);
                IRestResponse restResponse = restClient.Execute(restRequest);
                Item item = new JsonDeserializer().Deserialize<Item>((restResponse));

                return Ok(item);
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost]
        public ActionResult Post([FromBody] Item itemBody)
        {
            try
            {
                RestClient restClient = new RestClient(string.Format("http://localhost:5000/api/"));
                RestRequest restRequest = new RestRequest(string.Format("item/"), Method.POST);

                restRequest.AddJsonBody(itemBody);
                IRestResponse restResponse = restClient.Execute(restRequest);

                Item item = new JsonDeserializer().Deserialize<Item>((restResponse));

                return CreatedAtRoute("GetById", new { id = item.ID }, item);

            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPut("{id}")]
        public ActionResult Put([FromRoute] int id, [FromBody] Item itemBody)
        {
            try
            {
                RestClient restClient = new RestClient(string.Format("http://localhost:5000/api/"));
                RestRequest restRequest = new RestRequest(string.Format("item/{0}", id), Method.PUT);

                restRequest.AddJsonBody(itemBody);
                IRestResponse restResponse = restClient.Execute(restRequest);


                return new NoContentResult();
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            try
            {
                RestClient restClient = new RestClient(string.Format("http://localhost:5000/api/"));
                RestRequest restRequest = new RestRequest(string.Format("item/{0}", id), Method.DELETE);
                restClient.Execute(restRequest);

                return new NoContentResult();
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }
        [HttpGet("/api/rjs")]
        public ActionResult<List<ItemsList>> GetRjs()
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
