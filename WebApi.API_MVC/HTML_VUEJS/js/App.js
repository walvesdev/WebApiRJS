Vue.directive('money', {
    inserted(el, binding) {
        const amount = parseFloat(el.innerHTML).toFixed(2)
            .replace('.', ',')
            .replace(/(\d)(?=(\d{3})+\,)/g, '$1.')
        el.innerHTML = `${binding.value} ${amount}`
    }
});

Vue.filter('formatDate', function (item) {
    if (value) {
        return moment(item.date).format('YYYY-MM-DD');
    }
});

Vue.filter('money', function (item) {
    const amount = parseFloat(item).toFixed(2)
        .replace('.', ',')
        .replace(/(\d)(?=(\d{3})+\,)/g, '$1.')
    return item = `R$ ${amount}`
});

const app = new Vue({
    el: '#app',
    data: {
        items: [],
        item: {
            id: "",
            name: "",
            date: "",
            value: "",
            active: false
        },
        soma: 0

    },
    filters: {

    },
    methods: {
        Salvar(item) {
            try {
                if (item.id != 0) {
                    this.Editar(item);
                } else {

                    var newItem = {
                        name: item.name,
                        date: item.date,
                        value: item.value,
                        active: item.active
                    }
                    fetch('http://localhost:3000/api/ItemMVC',
                        {
                            method: "POST",
                            body: JSON.stringify(newItem),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(res => {
                            this.BuscarTodos();
                            toastr.success("Item salvo com sucesso!");
                        })
                        .catch((erro) => {
                            toastr.error(`Erro ao Salvar ${erro}`)

                        });
                }
            } catch (erro) {
                alert(`Erro ${erro}`)
            }
        },
        BuscarTodos() {
            try {
                fetch('http://localhost:3000/api/ItemMVC/')
                    .then(res => res.json())
                    .then(res => {
                        this.items = res;

                        this.PreencherTotal(this.items);
                        this.TabelaItems()

                    })
                    .catch(erro => toastr.error(`Erro ao buscar todos ${erro}`));
            } catch (erro) {
                alert(`Erro ${erro}`)
            }
        },
        Editar(item) {
            try {
                this.item = item;

                bootbox.confirm("Deseja editar o item selecionado?", function(result){
                    
                    fetch(`http://localhost:3000/api/ItemMVC/${app.item.id}`,
                        {
                            method: 'PUT',
                            body: JSON.stringify(item),
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(res => res.json())
                        .then((item) => {
                            app.BuscarTodos();
                            toastr.success("Item alterado com sucesso!");
                        })
                        .catch((erro) => {

                            toastr.error(`Erro ao editar ${erro}`)
                        });

                });
            } catch (erro) {
                alert(`Erro ${erro}`)
            }
        },
        Excluir(id) {
            try {
               this.item.id = id;

                bootbox.confirm("Deseja excluir o item selecionado?", function(result){
                    
                    fetch(`http://localhost:3000/api/ItemMVC/${app.item.id}`,
                        {
                            method: "DELETE",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }

                        })
                        .then((res) => {

                            var lista = app.items.filter(
                                function (item) {
                                    return item.id != id;
                                })
                            app.items = lista;
                            
                            app.PreencherTotal(app.items);
                            app.TabelaItems();
                            toastr.success("Item Excluído com sucesso!");
                        })
                        .catch(erro => toastr.error(`Erro ao processar ao excluir ${erro}`));
                
                })
                    
            } catch (erro) {
                alert(`Erro ${erro}`)
            }
        },
        EditarLinha(item) {
            this.item = {
                id: item.id,
                name: item.name,
                date: moment(item.date).format('YYYY-MM-DD'),
                value: item.value,
                active: item.active
            }
        },
        ExcluirLinha(id) {
            this.Excluir(id);
        },
        Cancelar(){
            this.item = {
                id: "",
                name: "",
                date: "",
                value: "",
                active: false
            }
        },
        PreencherTotal(listaItems) {
            this.soma = listaItems.map(i => i.value).reduce((a, b) => {
                return a + b;
            })
        },
        TabelaItems() {
            $(function () {
                $('#TabelaItems').DataTable();
            })
        }
    },
    mounted() {
        this.BuscarTodos()

    },

});