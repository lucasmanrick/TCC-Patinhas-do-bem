// Seleciona os botões de "Entrar" e "Cadastrar" no documento
var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");

// Seleciona o elemento <body> do documento
var body = document.querySelector("body");

// Adiciona um evento de clique no botão de "Entrar"
btnSignin.addEventListener("click", function () {
  // Quando o botão de "Entrar" for clicado, muda a classe do body para "sign-in-js"
  // Isso altera o layout para a tela de login
  body.className = "sign-in-js";
});

// Adiciona um evento de clique no botão de "Cadastrar"
btnSignup.addEventListener("click", function () {
  // Quando o botão de "Cadastrar" for clicado, muda a classe do body para "sign-up-js"
  // Isso altera o layout para a tela de cadastro
  body.className = "sign-up-js";
});

// Habilitar modo estrito, para garantir boas práticas de programação
("use strict");

// Seleciona os campos de endereço, bairro, cidade e estado no formulário
const input1 = document.getElementById("endereco");
const input2 = document.getElementById("bairro");
const input3 = document.getElementById("cidade");
const input4 = document.getElementById("estado");

// Desabilita os campos de endereço, bairro, cidade e estado até que o CEP seja preenchido corretamente
input1.disabled = true;
input2.disabled = true;
input3.disabled = true;
input4.disabled = true;

// Função para limpar os campos do formulário de endereço
const limparFormulario = (endereco) => {
  document.getElementById("endereco").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("estado").value = "";
};

// Função para preencher os campos do formulário de endereço com os dados retornados pelo CEP
const preencherFormulario = (endereco) => {
  document.getElementById("endereco").value = endereco.logradouro;
  document.getElementById("bairro").value = endereco.bairro;
  document.getElementById("cidade").value = endereco.localidade;
  document.getElementById("estado").value = endereco.uf;

  // Habilita os campos de endereço, bairro, cidade e estado quando o CEP é válido
  input1.disabled = false;
  input2.disabled = false;
  input3.disabled = false;
  input4.disabled = false;
};

// Função para verificar se a string contém apenas números
const eNumero = (numero) => /^[0-9]+$/.test(numero);

// Função para validar o CEP (verifica se ele tem 8 dígitos e se são todos números)
const cepValido = (cep) => cep.length == 8 && eNumero(cep);

// Função para pesquisar o CEP usando a API ViaCEP
const pesquisarCep = async () => {
  // Limpa o formulário antes de realizar a pesquisa
  limparFormulario();

  // Captura o valor do CEP digitado pelo usuário, removendo traços ou outros caracteres
  const cep = document.getElementById("cep").value.replace("-", "");
  // Monta a URL da API com o CEP fornecido
  const url = `https://viacep.com.br/ws/${cep}/json/`;

  // Verifica se o CEP é válido
  if (cepValido(cep)) {
    // Realiza a requisição à API ViaCEP e aguarda a resposta
    const dados = await fetch(url);
    // Converte os dados recebidos em JSON
    const endereco = await dados.json();

    // Verifica se a API retornou um erro (CEP inválido)
    if (endereco.hasOwnProperty("erro")) {
      // Exibe uma mensagem de erro se o CEP não foi encontrado
      document.getElementById("valido").innerHTML = "CEP não encontrado!";
    } else {
      // Preenche o formulário com os dados recebidos da API
      preencherFormulario(endereco);
      // Exibe uma mensagem informando que o CEP é válido
      document.getElementById("valido").innerHTML = "CEP válido!";
    }
  } else {
    // Exibe uma mensagem de erro se o CEP inserido for inválido
    document.getElementById("valido").innerHTML = "CEP incorreto!";
  }
};

// Adiciona um evento ao campo de CEP para pesquisar o CEP quando o usuário terminar de digitar (ao perder o foco do campo)
document.getElementById("cep").addEventListener("focusout", pesquisarCep);

//--------------------- FUNÇÃO PARA VALIDAR O EMAIL E A SENHA QUE FOR DIGITADO ----------------------------------------//

async function enviarDadosLogin(event) {
  event.preventDefault(); // Evita o envio padrão do formulário

  const dadosLogin = {
    Email: document.getElementById("email1").value,
    Senha: document.getElementById("password1").value,
  };

  try {
    const resposta = await fetch("/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosLogin),
    });

    const resultado = await resposta.json();
    if (resultado.auth) {
      alert("Login realizado com sucesso!");
      // Redirecionar o usuário ou salvar o token no armazenamento local se necessário
      window.location.href = "/FeedDeNoticias";
    } else {
      alert(`Erro: ${resultado.error}`);
    }
  } catch (erro) {
    console.error("Erro ao autenticar usuário:", erro);
  }
}



//--------------------------------------------------- FIM----------------------------------------------------//

//-------------------------------------------- VALIDAÇÃO DE CADASTRO ---------------------------------- //

function validateForm(event) {
  event.preventDefault();

  // Campos de informações pessoais e endereço
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  const birthdate = document.getElementById("birthdate").value.trim();
  const cep = document.getElementById("cep").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const estado = document.getElementById("estado").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const numero = parseInt(document.getElementById("numero").value.trim(), 10);

  // Verificações dos campos e senhas
  if (!name || !email || !password || !confirmPassword || !birthdate || !cep || !cidade || !estado || !bairro || !endereco || isNaN(numero) || numero <= 0) {
    alert("Por favor, preencha todos os campos corretamente!");
    return false;
  }

  if (password !== confirmPassword) {
    alert("As senhas não coincidem!");
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Por favor, insira um endereço de email válido!");
    return false;
  }

  if (password.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres!");
    return false;
  }

  // Dados do formulário
  const dados = {
    NomeUsuario: name,
    DataNasc: birthdate,
    Email: email,
    Senha: password,
    Cep: cep,
    Rua: endereco,
    Numero: numero,
    Bairro: bairro,
    Estado: estado,
    Cidade: cidade,
  };

  // Envia os dados do formulário ao backend
  fetch("/Cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then((resposta) => resposta.json())
    .then((resultado) => {
      if (resultado && resultado.success && resultado.success.includes("sucesso")) {
        const IDUsuario = resultado.IDUsuario;
        console.log("ID do usuário cadastrado:", IDUsuario);

        // Fazer upload da imagem para o Firebase usando o ID do usuário
        const file = document.getElementById("image-input").files[0];
        if (file) {
          const storageRef = storage.ref().child(`perfil/${IDUsuario}`);
          return storageRef.put(file)
            .then((snapshot) => {
              console.log("Upload concluído com sucesso!", snapshot);
              alert("Cadastro realizado com sucesso e imagem enviada!");

              // Limpar campos do formulário
              clearForm();
            })
            .catch((error) => {
              console.error("Erro ao fazer upload da imagem:", error);
              alert("Erro ao enviar a imagem. Por favor, tente novamente.");
            });
        } else {
          alert("Nenhuma imagem selecionada para upload.");
        }
      } else {
        alert("Erro no cadastro: " + (resultado.success || "Mensagem não especificada."));
      }
    })
    .catch((erro) => {
      console.error("Erro ao enviar dados:", erro);
      alert("Ocorreu um erro ao tentar enviar os dados. Por favor, tente novamente mais tarde.");
    });
}

// Função para limpar os campos do formulário
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirm-password").value = "";
  document.getElementById("birthdate").value = "";
  document.getElementById("cep").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("estado").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("endereco").value = "";
  document.getElementById("numero").value = "";
  document.getElementById("image-input").value = ""; // Limpa o campo da imagem
  document.body.className = "sign-in-js";
}


//--------------------------------------------------- FIM----------------------------------------------------//


// Seleciona o input e a imagem
const imageInput = document.getElementById("image-input");
const profileImage = document.getElementById("profile-image");

// Função para alterar a imagem quando o usuário seleciona um novo arquivo
imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    // Cria uma URL temporária para a imagem e a atribui ao src da imagem
    const imageUrl = URL.createObjectURL(file);
    profileImage.src = imageUrl;
  }
});

//-------------------------------------------- FIM  ------------------------------------------- //
