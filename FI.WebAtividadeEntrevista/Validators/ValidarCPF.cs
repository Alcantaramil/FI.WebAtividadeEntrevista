using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FI.WebAtividadeEntrevista.Validators
{
    public class CpfValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return ValidationResult.Success;
            }

            string cpf = Regex.Replace(value.ToString(), @"[^\d]", ""); 

            if (cpf.Length != 11)
            {
                return new ValidationResult(ErrorMessage ?? "CPF deve conter 11 dígitos.");
            }
            
            if (Regex.IsMatch(cpf, @"^(.)\1{10}$"))
            {
                return new ValidationResult(ErrorMessage ?? "CPF inválido.");
            }

            // Cálculo do 1º Dígito Verificador
            int soma = 0;
            for (int i = 0; i < 9; i++)
            {
                soma += int.Parse(cpf[i].ToString()) * (10 - i);
            }
            int resto = 11 - (soma % 11);
            int digito1 = (resto == 10 || resto == 11) ? 0 : resto;

            if (digito1 != int.Parse(cpf[9].ToString()))
            {
                return new ValidationResult(ErrorMessage ?? "CPF inválido.");
            }

            // Cálculo do 2º Dígito Verificador
            soma = 0;
            for (int i = 0; i < 10; i++)
            {
                soma += int.Parse(cpf[i].ToString()) * (11 - i);
            }
            resto = 11 - (soma % 11);
            int digito2 = (resto == 10 || resto == 11) ? 0 : resto;

            if (digito2 != int.Parse(cpf[10].ToString()))
            {
                return new ValidationResult(ErrorMessage ?? "CPF inválido.");
            }

            return ValidationResult.Success;
        }
    }
}
