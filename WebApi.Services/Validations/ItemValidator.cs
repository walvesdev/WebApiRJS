using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;
using WebApi.Models.ItemModel;

namespace WebApi.Services.Services.Validations
{

    public class ItemValidator : AbstractValidator<Item>
    {
        public ItemValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Digite o nome do item!")
                .Length(0, 50).WithMessage("O nome pode conter no maxo 50 caracteres");
            RuleFor(x => x.Date)
                .NotEmpty().WithMessage("Digite a data!");
            RuleFor(x => x.Active)
                .NotEmpty().WithMessage("Marque se é ativo!");
        }
    }
}