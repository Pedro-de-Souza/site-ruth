
let listaProdutosHTML = document.querySelector('.listaProdutos');
let listaCarrinhoHTML = document.querySelector('.listaCarrinho');
let iconCarrinho = document.querySelector('.iconeCarrinho');
let iconCarrinhoSpan = document.querySelector('.iconeCarrinho span');
let body = document.querySelector('body');
let fecharCarrinho = document.querySelector('.fechar');
let produtos = [];
let Carrinho = [];
let searchInput = document.getElementById('buscaInput');


let cartProd = document.querySelector('.item');

iconCarrinho.addEventListener('click', () => {
    body.classList.toggle('mostrarCarrinho');
})
fecharCarrinho.addEventListener('click', () => {
    body.classList.toggle('mostrarCarrinho');
})

const addDataNoHTML = (produtosParaMostrar) => {
    listaProdutosHTML.innerHTML = '';
    if (produtosParaMostrar.length > 0) {
        produtosParaMostrar.forEach(produto => {
            let novoproduto = document.createElement('div');
            novoproduto.dataset.id = produto.id;
            novoproduto.classList.add('item');
            novoproduto.innerHTML =
                `
                  
                <a href="${produto.link}" class="item-link">  
                    <img src="${produto.imagem}" alt="${produto.nome}"> 
                    <br/>
                    <hr/>
                     
                    <h2>${produto.nome}</h2>
                    <div class="preco">R$ ${produto.preco}</div>
                </a>
                <button class="addCarrinho" data-id="${produto.id}">Adicionar no Carrinho</button>
               `
            listaProdutosHTML.appendChild(novoproduto);
        });
    } else {
        listaProdutosHTML.innerHTML = '<p>Nenhum produto encontrado.</p>';
    }
}
listaProdutosHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCarrinho')) {
        let id_produto = positionClick.parentElement.dataset.id;
        addNoCarrinho(id_produto);
    }
})
const addNoCarrinho = (produto_id) => {
    let posicaoDoProdutoNoCarrinho = Carrinho.findIndex((value) => value.produto_id == produto_id);
    if (Carrinho.length <= 0) {
        Carrinho = [{
            produto_id: produto_id,
            quantidade: 1
        }];
    } else if (posicaoDoProdutoNoCarrinho < 0) {
        Carrinho.push({
            produto_id: produto_id,
            quantidade: 1
        });
    } else {
        Carrinho[posicaoDoProdutoNoCarrinho].quantidade = Carrinho[posicaoDoProdutoNoCarrinho].quantidade + 1;
    }
    addCarrinhoNoHTML();
    addCarrinhoNaMemoria();
}
const addCarrinhoNaMemoria = () => {
    localStorage.setItem('Carrinho', JSON.stringify(Carrinho));
}
const addCarrinhoNoHTML = () => {
    listaCarrinhoHTML.innerHTML = '';
    let totalquantidade = 0;
    let precoTotal = 0;
    if (Carrinho.length > 0) {
        Carrinho.forEach(item => {
            totalquantidade = totalquantidade + item.quantidade;
            let novoItem = document.createElement('div');
            novoItem.classList.add('itemCar');
            novoItem.dataset.id = item.produto_id;

            let posicaoproduto = produtos.findIndex((value) => value.id == item.produto_id);
            let info = produtos[posicaoproduto];
            listaCarrinhoHTML.appendChild(novoItem);
            let itemPrecoTotal = info.preco * item.quantidade;
            precoTotal += itemPrecoTotal;
            novoItem.innerHTML = `
            
            <div class="imagem">
                    <img src="${info.imagem}">
                </div>
                <div class="nome">
                ${info.nome}
                </div>
                <div class="totalpreco">R$ ${info.preco * item.quantidade}</div>
                <div class="quantidade">
                    <span class="menos"><</span>
                    <span>${item.quantidade}</span>
                    <span class="mais">></span>
                </div>
            
   
            `;
        })
    }

    iconCarrinhoSpan.innerText = totalquantidade;
    let precoTotalElement = document.querySelector('#totalCarrinho');
    if (!precoTotalElement) {
        precoTotalElement = document.createElement('div');
        precoTotalElement.classList.add('precoTotal');
        listaCarrinhoHTML.appendChild(precoTotalElement);
    }
    precoTotalElement.innerText = "R$"+precoTotal.toFixed(2);

}

listaCarrinhoHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('menos') || positionClick.classList.contains('mais')) {
        let produto_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'menos';
        if (positionClick.classList.contains('mais')) {
            type = 'mais';
        }
        mudarquantidadeCarrinho(produto_id, type);
    }
})
const mudarquantidadeCarrinho = (produto_id, type) => {
    let posisaoItemNoCarrinho = Carrinho.findIndex((value) => value.produto_id == produto_id);
    if (posisaoItemNoCarrinho >= 0) {
        var info = Carrinho[posisaoItemNoCarrinho];
        switch (type) {
            case 'mais':
                Carrinho[posisaoItemNoCarrinho].quantidade = Carrinho[posisaoItemNoCarrinho].quantidade + 1;
                break;

            default:
                let mudarquantidade = Carrinho[posisaoItemNoCarrinho].quantidade - 1;
                if (mudarquantidade > 0) {
                    Carrinho[posisaoItemNoCarrinho].quantidade = mudarquantidade;
                } else {
                    Carrinho.splice(posisaoItemNoCarrinho, 1);
                }
                break;
        }
    }
    addCarrinhoNoHTML();
    addCarrinhoNaMemoria();
}

searchInput.addEventListener('input', (event) => {
    let query = event.target.value.toLowerCase();
    let produtosFiltrados = produtos.filter(produto => 
        produto.nome.toLowerCase().includes(query)
    );
    addDataNoHTML(produtosFiltrados);
});



const inicApp = () => {
    fetch('produtos.json')
        .then(response => response.json())
        .then(data => {
            produtos = data;
            addDataNoHTML(produtos);
            if (localStorage.getItem('Carrinho')) {
                Carrinho = JSON.parse(localStorage.getItem('Carrinho'));
                addCarrinhoNoHTML();
            }
        })

}



inicApp();