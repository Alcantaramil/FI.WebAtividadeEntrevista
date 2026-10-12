using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;

namespace WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();


            if (bo.VerificarExistencia(model.CPF.Replace(".", "").Replace("-", ""), model.IdCliente))
            {
                Response.StatusCode = 400;
                return Json("CPF: " + model.CPF + " já cadastrado para este cliente!");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {

                model.Id = bo.Incluir(new Beneficiario()
                {
                    CPF = model.CPF.Replace(".", "").Replace("-", ""),
                    Nome = model.Nome,
                    IdCliente = model.IdCliente
                });


                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                bo.Alterar(new Beneficiario()
                {
                    Id = model.Id,
                    CPF = model.CPF.Replace(".", "").Replace("-", ""),
                    Nome = model.Nome,
                    IdCliente = model.IdCliente
                });

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public JsonResult Alterar(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            Beneficiario beneficiario = bo.Consultar(id);
            Models.BeneficiarioModel model = null;

            if (beneficiario != null)
            {
                model = new BeneficiarioModel()
                {
                    Id = beneficiario.Id,
                    CPF = beneficiario.CPF,
                    Nome = beneficiario.Nome,
                };


            }

            return Json(model, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Listar(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            var lista = bo.Listar(id);
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Excluir(int id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            bo.Excluir(id);

            return Json("Beneficiário excluído com sucesso");
        }
    }
}