// Função para alternar a exibição das seções "Meus pets" e "Postagens"
function alternarSecao(secao) {
    // Oculta todas as seções inicialmente
    document.getElementById("meus-pets").style.display = "none";
    document.getElementById("postagens").style.display = "none";

    // Exibe a seção correspondente ao botão clicado
    document.getElementById(secao).style.display = "block";

    // Muda a aparência do indicador para a seção ativa
    const indicator = document.getElementById("indicator");
    const meusPetsLink = document.getElementById("meus-pets-link");
    const postagensLink = document.getElementById("postagens-link");

    // Define o indicador abaixo do link ativo
    if (secao === "meus-pets") {
        indicator.style.left = meusPetsLink.offsetLeft + "px";
        indicator.style.width = meusPetsLink.offsetWidth + "px";
    } else if (secao === "postagens") {
        indicator.style.left = postagensLink.offsetLeft + "px";
        indicator.style.width = postagensLink.offsetWidth + "px";
    }
}

// Evento de clique para exibir a seção "Meus pets"
document.getElementById("meus-pets-link").addEventListener("click", function (event) {
    event.preventDefault();
    alternarSecao("meus-pets");
});

// Evento de clique para exibir a seção "Postagens"
document.getElementById("postagens-link").addEventListener("click", function (event) {
    event.preventDefault();
    alternarSecao("postagens");
});



// Botão "Início" redireciona para a página inicial
document.getElementById('inicio-button').addEventListener('click', function () {
    window.location.href = 'index.html'; // Altere para a URL desejada
});




function showContent(menuId) {
    // Esconde todos os conteúdos
    document.getElementById('mural-content').style.display = 'none';
    document.getElementById('notifications-content').style.display = 'none';
    document.getElementById('view-animals-content').style.display = 'none';
    document.getElementById('Cadastrar-Pets').style.display = 'none'

    // Mostra o conteúdo selecionado
    if (menuId === 'mural') {
        document.getElementById('mural-content').style.display = 'block';
    }
    else if (menuId === 'notifications') {
        document.getElementById('notifications-content').style.display = 'block';
    }
    else if (menuId === 'Cadastro') {
        document.getElementById('Cadastrar-Pets').style.display = 'block'
    }
    else if (menuId === 'view-animals') {
        document.getElementById('view-animals-content').style.display = 'block';
    }

}






 // Exemplo de dados dos pets do usuário
 const petsUsuario = [
    {
      id: 1,
      nome: "Max",
      idade: "2 anos",
      raca: "Golden Retriever",
      imagem: "https://example.com/max.jpg" // URL da imagem do pet
    },
    {
      id: 2,
      nome: "Luna",
      idade: "1 ano",
      raca: "Bulldog Francês",
      imagem: "https://example.com/luna.jpg" // URL da imagem do pet
    },
    {
      id: 3,
      nome: "Mia",
      idade: "3 anos",
      raca: "Poodle",
      imagem: "https://example.com/mia.jpg" // URL da imagem do pet
    
    }
  ];
  
  // Função para exibir a lista de pets do usuário
  function exibirPets() {
    const petsDiv = document.getElementById("lista-pets");
    petsDiv.innerHTML = ""; // Limpa o conteúdo atual
  
    petsUsuario.forEach(pet => {
      const petElemento = document.createElement("div");
      petElemento.classList.add("pet-card");
  
      petElemento.innerHTML = `
        <img src="${pet.imagem}" alt="${pet.nome}" class="imagem-pet">
        <h4>${pet.nome}</h4>
        <p><strong>Idade:</strong> ${pet.idade}</p>
        <p><strong>Raça:</strong> ${pet.raca}</p>
      `;
      
      petsDiv.appendChild(petElemento);
    });
  
    document.getElementById("meus-pets").style.display = "block"; // Exibe a div dos pets
  }
  
  // Exibe a lista de pets ao carregar a página
  exibirPets();