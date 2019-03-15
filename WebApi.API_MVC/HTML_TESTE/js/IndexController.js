let indexController;

class IndexController {


    GetItemSemId() {

        var name = $('#name').val().trim();
        var date = $('#date').val().trim();
        var value = $('#value').val().trim();
        var active = $('#active').prop('checked');

        var item = {
            name: name,
            active: active,
            date: date,
            value: value
        }
        return item;
    }
    GetItemComId() {
        var name = $('#name').val().trim();
        var date = $('#date').val().trim();
        var value = $('#value').val().trim();
        var active = $('#active').prop('checked');
        var id = $('#id').val().trim();

        var item = {
            id: id,
            name: name,
            active: active,
            date: date,
            value: value
        }
        return item;
    }
    Salvar() {
        try {
            var itemId = indexController.GetItemComId();
            var item = indexController.GetItemSemId();

            if (itemId.id != "") {
                indexController.Editar(itemId);
            } else {

                if (item.nome == "" || item.date == "" || item.value == "") {
                    alert('Informe todos os dado para ser cadastrados!')
                } else {
                    $.ajax({
                        url: 'http://localhost:5000/api/item',
                        type: "post",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify(item)
                    })
                        .done(function (item) {
                            indexController.LimparCampos();
                            location.reload();
                        })
                        .fail(function () {
                            alert("Falha ao inserir item!")
                        })
                }
            }
        } catch (erro) {
            alert(`Erro ${erro}`)
        }
    }
    BuscarTodos() {
        try {
            $.ajax({
                url: 'http://localhost:5000/api/item',
            })
                .done(function (resultado) {
                    var listaItems = resultado;
                    indexController.PreencherTabela(listaItems);
                    indexController.PreencherTotal(listaItems);
                })
                .fail(function () {
                    alert("Items não encontrado!")
                })
        } catch (erro) {
            alert(`Erro ${erro}`)
        }
    }
    Editar(itemId) {
        if (itemId.id != null && itemId.id != "") {

            if (itemId.date != null && itemId.date != "") {
                try {
                    //var item = indexController.GetItemComId();

                    $.ajax({
                        url: `http://localhost:5000/api/item/${itemId.id}`,
                        type: "put",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data: JSON.stringify(itemId)
                    })
                        .done(function (item) {
                            indexController.LimparCampos();
                            location.reload();
                        })
                        .fail(function () {
                            alert("Item não encontrado!")
                        })
                } catch (erro) {
                    alert(`Erro ${erro}`)
                }
            } else {
                alert('Informa a data do item!');
            }
        } else {
            alert('Selecione um item para ser excluido!');
        }

    }
    Excluir(id) {

        try {
            if (confirm('Desja excluir o item selecionado?')) {
                //var item = indexController.GetItemComId();
                $.ajax({
                    url: `http://localhost:5000/api/item/${id}`,
                    type: "delete"
                })
                    .done(function (item) {
                        indexController.LimparCampos();
                        location.reload();
                    })
                    .fail(function () {
                        alert("Item não encontrado!")
                    })
            }
        } catch (erro) {
            alert(`Erro ${erro}`)
        }
    }

    Cancelar() {
        indexController.LimparCampos();
    }
    LimparCampos() {

        $('#name').val("");
        $('#date').val("");
        $('#value').val("");
        $('#id').val("");
        $('#active').prop('checked', false);
        $('.linha').removeClass("linha");

    }
    PreencherTabela(listaItems) {
        for (var item of listaItems) {
            $('.tabela').append(`
                <tr>
                <td>${item.id}</td>
                <td>${item.active}</td>
                <td>${item.name}</td>
                <td>${item.date}</td>
                <td>${item.value}</td> 
                <td><a class="fas fa-pencil-alt editar"></a>   |  <a class="fas fa-trash-alt remover"></a></td>
                </tr>                         
                `);
        }
    }
    PreencherItemTabela(item) {
        $('.tabela').append(`
                <tr>
                <td>${item.id}</td>
                <td>${item.active}</td>
                <td>${item.name}</td>
                <td>${item.date}</td>
                <td>${item.value}</td>   
                </tr>                         
                `);
    }
    PreencherTotal(listaItems) {
        var soma = listaItems.map(i => i.value).reduce((a, b) => {
            return a + b;
        })
        $('.total').append(`
        <h5 class="totalH5">Total R$: ${soma}</h5>
        `);
    }
    PreencherDataTable(dataset) {

        $('#listarTabela').DataTable({
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese-Brasil.json"
            },
            data: dataset,

            "columns": [
                { "data": "id" },
                { "data": "active" },
                { "data": "name" },
                { "data": "date", render: function (data) { return (moment(data).format('DD/MM/YYYY')) } },
                { "data": "value" },
                {
                    "data": null, render: function () {
                        return '<i class="fas fa-pencil-alt editar"></i>' + '   |   ' + '<i class="fas fa-trash-alt"></i>';

                    }
                }
            ]
        });
        indexController.PreencherTotal(dataset);

    }
    GetDatSet() {

        try {
            $.get({
                url: 'http://localhost:5000/api/item',
            })
                .done(function (resultado) {
                    indexController.PreencherDataTable(resultado)
                })
                .fail(function () {
                    alert("Items não encontrado!")
                })
        } catch (erro) {
            alert("Items não encontrado!");

        }
    }
    ItemInputs() {

        let id;
        let active;
        let name;
        let date;
        let value;
        let editar;
        let excluir;

        $("#divTabela #listarTabela tbody").on("click", "tr", function (e) {
            e.preventDefault();
            e.stopPropagation();

            $('.linha').removeClass("linha");
            $(this).addClass("linha");

            id = $(this).children().first().text();
            active = JSON.parse($(this).children().first().next().text());
            name = $(this).children().first().next().next().text();
            date = $(this).children().first().next().next().next().text();
            value = $(this).children().first().next().next().next().next().text();

            editar = $(this).children().first().next().next().next().next().next().children().first();
            excluir = $(this).children().first().next().next().next().next().next().children().first().next();

            editar.click(function (e) {
                e.preventDefault();
                e.stopPropagation();

                $('#name').val(name);
                $('#date').val(date);
                $('#value').val(value);
                $('#id').val(id);
                $('#active').prop('checked', active);
            })
            excluir.click(function (e) {
                e.preventDefault();
                e.stopPropagation();

                indexController.Excluir(id);
                $('.linha').removeClass("linha");
                location.reload();

            });
           
        });


    }
}

function main() {
    indexController = new IndexController();
    indexController.BuscarTodos();
    indexController.ItemInputs();

}

window.onload = main;