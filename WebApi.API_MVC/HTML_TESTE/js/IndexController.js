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
            var item = indexController.GetItemSemId();
            if (item.hasOwnProperty(item.id)) {                
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
    Editar() {
        if ($('#id').val().trim() != null && $('#id').val().trim() != "") {

            if ($('#date').val().trim() != null && $('#date').val().trim() != "") { 
            try {
                var item = indexController.GetItemComId();

                $.ajax({
                    url: `http://localhost:5000/api/item/${item.id}`,
                    type: "put",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(item)
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
    Excluir() {
        if ($('#id').val().trim() != null && $('#id').val().trim() != "" && confirm('Desja excluir o item selecionado?')) {

            try {
                var item = indexController.GetItemComId();
                $.ajax({
                    url: `http://localhost:5000/api/item/${item.id}`,
                    type: "delete"
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
            alert('Selecione um item para ser excluido!');
        }
    }
    Cancelar() {
        $("#salvar").prop('disabled', false);
        indexController.LimparCampos();
    }
    LimparCampos() {

        $('#name').val("");
        $('#date').val("");
        $('#value').val("");
        $('#id').val("");
        $('#active').prop('checked', false);

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
                { "data": "value" }
            ]
        });
        indexController.PreencherTotal(dataset);

    }
    GetDatSet() {

        try {
            $.ajax({
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
        $("#listarTabela tbody").on("click", "tr", function () {
            
                $('.selected').css('backgroun-color', 'red')
                $("#salvar").prop('disabled', true);

                var id = $(this).children().first().text();
                var active = JSON.parse($(this).children().first().next().text());
                var name = $(this).children().first().next().next().text();
                var date = $(this).children().first().next().next().next().text();
                var value = $(this).children().first().next().next().next().next().text();

                $('#name').val(name);
                $('#date').val(date);
                $('#value').val(value);
                $('#id').val(id);
                $('#active').prop('checked', active);
            
        });
    }
}

function main() {
    indexController = new IndexController();
    indexController.GetDatSet();
    indexController.ItemInputs();

}

window.onload = main;