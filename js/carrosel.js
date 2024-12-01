let listaProdutosHTML = document.querySelector('.lista1');
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
            novoproduto.classList.add('item1');
            novoproduto.innerHTML =
                `
                  
                <a href="${produto.link}" class="item-link">  
                    <img src="${produto.imagem}" alt="${produto.nome}"> 
                    <br/>
                    <hr/>
                     
                    <h2>${produto.nome}</h2>
                    <div class="preco">R$ ${produto.preco}</div>
                </a>
               `
            listaProdutosHTML.appendChild(novoproduto);
        });
    } else {
        listaProdutosHTML.innerHTML = '<p>Nenhum produto encontrado.</p>';
    }
}




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