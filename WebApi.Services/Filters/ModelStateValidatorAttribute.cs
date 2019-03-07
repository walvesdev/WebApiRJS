using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace WebApi.Services.Services.Filters
{
    public class ModelStateValidatorAttribute : ActionFilterAttribute
    {        
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            Controller controller = context.Controller as Controller;

            var controllerName = context.RouteData.Values["controller"].ToString(); ;
            var actionName = context.RouteData.Values["action"].ToString(); 


            if (!context.ModelState.IsValid)
            {
                context.Result = new ViewResult
                {
                    ViewName = actionName,
                    ViewData = controller.ViewData,
                    TempData = controller.TempData
                };
            }
            base.OnActionExecuting(context);
        }
    }
}
