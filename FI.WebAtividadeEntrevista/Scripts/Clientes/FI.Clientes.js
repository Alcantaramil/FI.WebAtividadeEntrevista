
$(document).ready(function () {
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        
        var dadosCliente = {
            "NOME": $(this).find("#Nome").val(),
            "Sobrenome": $(this).find("#Sobrenome").val(),
            "CPF": $(this).find("#CPF").val(),
            "Nacionalidade": $(this).find("#Nacionalidade").val(),
            "CEP": $(this).find("#CEP").val(),
            "Estado": $(this).find("#Estado").val(),
            "Cidade": $(this).find("#Cidade").val(),
            "Logradouro": $(this).find("#Logradouro").val(),
            "Email": $(this).find("#Email").val(),
            "Telefone": $(this).find("#Telefone").val(),
            "Beneficiarios": beneficiariosTemporarios
        };

        $.ajax({
            url: urlPost,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(dadosCliente),
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $('#formCadastro')[0].reset();
                $('#formCadastroBeneficiario')[0].reset();
            }
        });
    });
});

function resetarFormularioBeneficiario() {
    $('#formCadastroBeneficiario')[0].reset();
    $('#BeneficiarioId').val("0");
    $('#btnSalvarBeneficiario').text("Incluir").attr("title", "Incluir").removeClass("btn-primary").addClass("btn-success");
}

var beneficiariosTemporarios = [];

function renderizarGridTemporario() {
    var linhas = "";
    if (beneficiariosTemporarios.length > 0) {
        $.each(beneficiariosTemporarios, function (i, item) {
            let cpfFormatado = formatarCPF(item.CPF);
            linhas += '<tr>' +
                '<td>' + cpfFormatado + '</td>' +
                '<td>' + item.Nome + '</td>' +
                '<td>' +
                '<button type="button" class="btn btn-primary btn-sm mr-1" onclick="preencherAlteracaoTemp(' + item.TempId + ')">Alterar</button> ' +
                '<button type="button" class="btn btn-danger btn-sm" onclick="excluirBeneficiarioTemp(' + item.TempId + ')">Excluir</button>' +
                '</td>' +
                '</tr>';
        });
    } else {
        linhas = '<tr><td colspan="3" class="text-center">Nenhum beneficiário adicionado.</td></tr>';
    }
    $('#gridBeneficiarios tbody').html(linhas);
}

$('#formCadastroBeneficiario').submit(function (e) {
    e.preventDefault();

    let cpf = $(this).find("#CPFBeneficiario").val();
    let nome = $(this).find("#NomeBeneficiario").val();
    let tempId = $('#BeneficiarioId').val();

    
    if (!validarCPF(cpf)) {
        ModalDialog("Atenção", "Digite um CPF válido");
        return;
    }

    let cpfLimpo = formatarCPF(cpf);
    
    let cpfDuplicado = beneficiariosTemporarios.some(function (ben) {
        let benCpfLimpo = formatarCPF(ben.CPF);

        if (tempId > 0 && ben.TempId == tempId) {
            return false;
        }
        return benCpfLimpo === cpfLimpo;
    });

    if (cpfDuplicado) {
        ModalDialog("Atenção", "O CPF " + cpf + " já foi adicionado na lista de beneficiários.");
        return;
    }

    if (tempId > 0) {        
        let ben = beneficiariosTemporarios.find(b => b.TempId == tempId);
        if (ben) {
            ben.CPF = cpf;
            ben.Nome = nome;
        }
    } else {        
        beneficiariosTemporarios.push({
            TempId: Date.now(),
            CPF: cpf,
            Nome: nome
        });
    }

    resetarFormularioBeneficiario();
    renderizarGridTemporario();
});

function excluirBeneficiarioTemp(tempId) {
    beneficiariosTemporarios = beneficiariosTemporarios.filter(b => b.TempId != tempId);
    renderizarGridTemporario();
}

function preencherAlteracaoTemp(tempId) {
    let ben = beneficiariosTemporarios.find(b => b.TempId == tempId);
    if (ben) {
        $('#BeneficiarioId').val(ben.TempId);
        $('#CPFBeneficiario').val(formatarCPF(ben.CPF));
        $('#NomeBeneficiario').val(ben.Nome);
        $('#btnSalvarBeneficiario').text("Salvar").attr("title", "Salvar Alterações") .removeClass("btn-success").addClass("btn-primary");
    }
}

function mascaraCPF(input) {
    let valor = input.value.replace(/\D/g, "");
    if (valor.length > 11) valor = valor.substring(0, 11);

    if (valor.length > 9) {
        valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{3})(\d{3})(\d{3}).*/, "$1.$2.$3");
    } else if (valor.length > 3) {
        valor = valor.replace(/^(\d{3})(\d{3}).*/, "$1.$2");
    }
    input.value = valor;
}
function formatarCPF(cpf) {
    if (!cpf) return "";
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length === 11) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return cpf;
}
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;

    // Elimina CPFs invalidos conhecidos (todos os dígitos iguais)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do 1º dígito
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    // Validação do 2º dígito
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = (resto === 10 || resto === 11) ? 0 : resto;
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true;
}
function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
