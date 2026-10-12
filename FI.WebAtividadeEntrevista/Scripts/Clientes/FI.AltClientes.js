
$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(formatarCPF(obj.CPF));

        $('#btnBeneficiarios').prop('disabled', false);
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val(),
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                    window.location.href = urlRetorno;
                }
        });
    })


    $('#modalBeneficiario').on('show.bs.modal', function () {
        resetarFormularioBeneficiario();
        carregarBeneficiarios(obj.Id);
    });


    $('#formCadastroBeneficiario').submit(function (e) {
        e.preventDefault();

        var idBeneficiario = $('#BeneficiarioId').val();

        $.ajax({
            url: idBeneficiario == 0 ? '/Beneficiario/Incluir' : '/Beneficiario/Alterar',
            method: "POST",
            data: {
                "IdCliente": obj.Id,
                "Id": idBeneficiario,
                "CPF": $(this).find("#CPFBeneficiario").val(),
                "Nome": $(this).find("#NomeBeneficiario").val(),
            },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r);
                $('#formCadastroBeneficiario')[0].reset();
                resetarFormularioBeneficiario();
                carregarBeneficiarios();
            }
        });
    });
})

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

function carregarBeneficiarios() {
    $.ajax({
        url: '/Beneficiario/Listar/' + obj.Id,
        method: "GET",
        success: function (data) {
            var linhas = "";
            if (data && data.length > 0) {
                $.each(data, function (i, item) {
                    linhas += '<tr>' +
                        '<td>' + item.CPF + '</td>' +
                        '<td>' + item.Nome + '</td>' +
                        '<td><button type="button" class="btn btn-info btn-sm" title="Alterar" onclick="alterarBeneficiario(' + item.Id + ')">Alterar</button> <button type = "button" class="btn btn-danger btn-sm" title="Excluir" onclick = "excluirBeneficiario(' + item.Id + ')" > Excluir</button ></td > ' +
                        '</tr>';
                });
            } else {
                linhas = '<tr><td colspan="3" class="text-center">Nenhum beneficiário cadastrado.</td></tr>';
            }
            $('#gridBeneficiarios tbody').html(linhas);
        },
        error: function () {
            console.log("Erro ao carregar os beneficiários.");
        }
    });
}
function resetarFormularioBeneficiario() {
    $('#formCadastroBeneficiario')[0].reset();
    $('#BeneficiarioId').val("0");
    $('#btnSalvarBeneficiario').text("Incluir").attr("title", "Incluir").removeClass("btn-primary").addClass("btn-success");
}

function alterarBeneficiario(id) {

    $.ajax({
        url: '/Beneficiario/Alterar',
        method: "GET",
        data: { "id": id },
        success: function (data) {
            if (data) {
                $('#BeneficiarioId').val(data.Id);
                $('#CPFBeneficiario').val(formatarCPF(data.CPF));
                $('#NomeBeneficiario').val(data.Nome);
                $('#btnSalvarBeneficiario').text("Salvar").attr("title", "Salvar Alterações").removeClass("btn-success").addClass("btn-primary");
            }
        },
        error: function () {
            ModalDialog("Ocorreu um erro", "Não foi possível carregar os dados para alteração.");
        }
    });
}

function excluirBeneficiario(id) {
    if (!confirm("Deseja realmente excluir este beneficiário?")) {
        return;
    }

    $.ajax({
        url: '/Beneficiario/Excluir',
        method: "POST",
        data: {
            "Id": id
        },
        error: function (r) {
            if (r.status == 400)
                ModalDialog("Ocorreu um erro", r.responseJSON);
            else if (r.status == 500)
                ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
        },
        success: function (r) {
            ModalDialog("Sucesso!", r);
            carregarBeneficiarios();
        }
    });
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