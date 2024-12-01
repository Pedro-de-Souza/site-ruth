let conteinerPagina = document.querySelector('.containerProduct');
let paginaDoProd = document.querySelector('.paginaDoProd');
let imagemProd = document.querySelector('.imagemProd');
let infoProd = document.querySelector('.infoProd');
let precoBtn = document.querySelector('.preco-btn');



// Função para pegar o ID 
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}
const productId = getProductIdFromURL();

const jsonCerto = `json/prod${productId}.json`;
const jsonProdNum = `prod${productId}`;



fetch(jsonCerto).then((response) => {
    response.json().then((json) => {
      json.produtoSite.map((prod) => {
        let novaPaginaProd = document.createElement('div');
        novaPaginaProd.dataset.id = prod.id;
        novaPaginaProd.classList.add('pagProd');
        novaPaginaProd.innerHTML = `
        
        <div class="produtoImgInfo">

          <div class="imagemProd">
            <img src="imagem/${prod.id}.png" id="image" alt="...">
          </div>

          <div class="infoProd">
            <h1>${prod.nome}</h1>
            <p>${prod.descricao}</p>
              <div class="precoBtn">
                <span id="preco">R$${prod.preco},00</span>
                <button class="addCarrinho" data-id="${prod.id}">Adicionar no Carrinho</button>
              </div>
            </div>
        
        </div>
    `;
    paginaDoProd.appendChild(novaPaginaProd);
      });
    });
  });




  //======================================================
  let listaProdutosHTML = document.querySelector('.lista1');
  let listaCarrinhoHTML = document.querySelector('.listaCarrinho');
  let iconCarrinho = document.querySelector('.iconeCarrinho');
  let iconCarrinhoSpan = document.querySelector('.iconeCarrinho span');
  let body = document.querySelector('body');
  let fecharCarrinho = document.querySelector('.fechar');
  let produtos = [];
  let Carrinho = [];
  let searchInput = document.getElementById('buscaInput');
  
  
  
  iconCarrinho.addEventListener('click', () => {
      body.classList.toggle('mostrarCarrinho');
  })
  fecharCarrinho.addEventListener('click', () => {
      body.classList.toggle('mostrarCarrinho');
  })
  

  
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
              novoItem.classList.add('item');
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
  //======================================================
  
console.log(productId); // Verificar se o ID está correto
