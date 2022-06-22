using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ModelSaber.Main.Controllers
{
    public class MainApiController : Controller
    {
        [Route("api/")]
        public IActionResult Index()
        {
            return Ok(new {
                BuildVersion = Program.Version.ToString(3),
                BuildTime = $"{Program.CompiledTime.ToUniversalTime():s}Z"
            });
        }
    }
}
