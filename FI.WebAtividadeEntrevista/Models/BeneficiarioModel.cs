using FI.WebAtividadeEntrevista.Validators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Beneficiário
    /// </summary>
    public class BeneficiarioModel
    {
        public long Id { get; set; }

        /// <summary>
        /// Sobrenome
        /// </summary>
        /// <summary>
        /// CPF
        /// </summary>
        [Required(ErrorMessage = "O CPF do Beneficiário é obrigatório")]
        [CpfValidation(ErrorMessage = "Digite um CPF válido")]
        public string CPF { get; set; }
        /// <summary>
        /// CEP
        /// </summary>
        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome { get; set; }
        public long IdCliente { get; set; }

    }    
}