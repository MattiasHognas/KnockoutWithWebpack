using Microsoft.AspNetCore.Mvc;

namespace Lab.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult TestA() => View();
        public IActionResult TestB() => View();
    }
}
