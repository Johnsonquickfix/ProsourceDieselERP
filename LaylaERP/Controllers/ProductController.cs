using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LaylaERP.Controllers
{
    public class ProductController : Controller
    {
        // Add Product
        public ActionResult AddNewProduct()
        {
            return View();
        }

        // Listing Products
        public ActionResult ListProduct()
        {
            return View();
        }

        // Products Categories
        public ActionResult ProductCategories()
        {
            return View();
        }

        // Products Attributes
        public ActionResult ProductAttributes()
        {
            return View();
        }
    }
}