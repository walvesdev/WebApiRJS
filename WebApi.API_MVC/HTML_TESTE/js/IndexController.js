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
                $.ajax({
                    url: `http://localhost:5000/api/item/${id}`,
                    type: "delete"
                })
                    .done(function (item) {
                        indexController.LimparCampos();
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
    PreencherItemTabela(item) {

        $(`#item-${item.id}-id`).remove();
        $(`#item-${item.id}-active`).remove();
        $(`#item-${item.id}-name`).remove();
        $(`#item-${item.id}-date`).remove();
        $(`#item-${item.id}-value`).remove();
        $(`#item-${item.id}-acao`).remove();

        $(`#item-${item.id}`).append(`                
                <td id="item-${item.id}-id">${item.id}</td>
                <td id="item-${item.id}-active">${item.active}</td>
                <td id="item-${item.id}-name">${item.name}</td>
                <td id="item-${item.id}-date">${(moment(item.date).format('YYYY-MM-DD'))}</td>
                <td id="item-${item.id}-value">${item.value}</td>  
                <td id="item-${item.id}-acao"><a class="fas fa-pencil-alt editar" onclick="indexController.EditarLinha(${item.id})"></a>   |  <a class="fas fa-trash-alt remover" onclick="indexController.ExcluirLinha(${item.id})"></a></td>
                `);

    }
    PreencherTabela(listaItems) {
        for (var item of listaItems) {
            $('.tabela').append(`
                <tr id="item-${item.id}">
                <td id="item-${item.id}-id">${item.id}</td>
                <td id="item-${item.id}-active">${item.active}</td>
                <td id="item-${item.id}-name">${item.name}</td>
                <td id="item-${item.id}-date">${(moment(item.date).format('YYYY-MM-DD'))}</td>
                <td id="item-${item.id}-value">${item.value}</td> 
                <td id="item-${item.id}-acao"><a class="fas fa-pencil-alt editar" onclick="indexController.EditarLinha(${item.id})"></a>   |  <a class="fas fa-trash-alt remover" onclick="indexController.ExcluirLinha(${item.id})"></a></td>
                </tr>                         
                `);
        }
    }
    PreencherTotal(listaItems) {
        var soma = listaItems.map(i => i.value).reduce((a, b) => {
            return a + b;
        })
        $('.total').append(`
        <h5 class="totalH5">Total R$: ${soma}</h5>
        `);
    }
    EditarLinha(id) {

        indexController.LimparCampos();

        $(`#item-${id}`).removeClass("linha");
        $(`#item-${id}`).addClass("linha");

        var id = id;
        var active = JSON.parse($(`#item-${id}-active`).text());
        var name = $(`#item-${id}-name`).text();
        var date = $(`#item-${id}-date`).text();
        var value = $(`#item-${id}-value`).text();

        $('#name').val(name);
        $('#date').val(date);
        $('#value').val(value);
        $('#id').val(id);
        $('#active').prop('checked', active);
    }
    ExcluirLinha(id) {

        indexController.Excluir(id);

        $(`#item-${id}`).remove();
        $(`#item-${id}`).removeClass("linha");
    }
}

function main() {
    indexController = new IndexController();
    indexController.BuscarTodos();

}

window.onload = main;