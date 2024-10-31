

function searchContent() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const posts = document.querySelectorAll('.post'); // Selecione todos os posts

  posts.forEach(post => {
      const title = post.querySelector('.post-title') ? post.querySelector('.post-title').textContent.toLowerCase() : '';
      const content = post.querySelector('.post-content') ? post.querySelector('.post-content').textContent.toLowerCase() : '';
      const animalInfo = post.querySelector('.formulario-do-pet') ? post.querySelector('.formulario-do-pet').textContent.toLowerCase() : ''; // Para informações do pet
      
      // Verifica se a busca está contida no título, no conteúdo ou nas informações do animal
      if (title.includes(query) || content.includes(query) || animalInfo.includes(query)) {
          post.style.display = 'block'; // Mostra o post se a busca corresponder
      } else {
          post.style.display = 'none'; // Esconde o post se não corresponder
      }
  });
}


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
  else if (menuId === 'Cadastro'){
      document.getElementById('Cadastrar-Pets').style.display = 'block'
  }
  else if (menuId === 'view-animals') {
      document.getElementById('view-animals-content').style.display = 'block';
  }
  
}

function publishPost() {
  const title = document.getElementById('post-title').value;
  const content = document.getElementById('post-content').value;
  const imageInput = document.getElementById('post-image');
  const postsContainer = document.getElementById('posts-container');

  if (title && content) {
      const postDiv = document.createElement('div');
      postDiv.className = 'post';

      // Adiciona o título
      const postTitle = document.createElement('h4');
      postTitle.innerText = title;
      postDiv.appendChild(postTitle);

      // Adiciona a imagem, se houver
      if (imageInput.files && imageInput.files[0]) {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(imageInput.files[0]);
          img.style.width = '100%'; // Ajusta a largura da imagem
          img.style.maxWidth = '500px'; // Largura máxima
          postDiv.appendChild(img);
      }

      // Adiciona o conteúdo
      const postContent = document.createElement('p');
      postContent.innerText = content;
      postDiv.appendChild(postContent);

      // Adiciona a nova postagem ao container
      postsContainer.prepend(postDiv); // Adiciona ao início da lista de postagens

      // Limpa os campos
      document.getElementById('post-title').value = '';
      document.getElementById('post-content').value = '';
      imageInput.value = ''; // Limpa o campo de imagem

      closePublishModal(); // Fecha o modal
  } else {
      alert('Por favor, preencha todos os campos!');
  }
}
let currentChatUser = '';



const inputs = document.querySelectorAll('.animal');
  const btnSalvar = document.querySelector('.btn-salvar');

  inputs.forEach(input => {
      input.addEventListener('input', () => {
          btnSalvar.disabled = !Array.from(inputs).every(input => input.value.trim() !== '');
      });
  });




// Evento para o botão Curtir
document.querySelector('.like-button').addEventListener('click', function() {
  alert('Você curtiu a postagem!');
});

// Evento para o botão Comentar
document.querySelector('.submit-comment').addEventListener('click', function() {
  const comment = document.querySelector('.comment-input').value;
  if(comment) {
      alert('Comentário enviado: ' + comment);
      document.querySelector('.comment-input').value = ''; // Limpa o campo de comentário
  } else {
      alert('Por favor, escreva um comentário.');
  }
});


// Evento para o botão Publicar comentário
document.querySelector('.submit-comment').addEventListener('click', function() {
  const comment = document.querySelector('.comment-input').value;
  if(comment) {
      alert('Comentário enviado: ' + comment);
      document.querySelector('.comment-input').value = ''; // Limpa o campo de comentário
  } else {
      alert('Por favor, escreva um comentário.');
  }
});

//CÓDIGO PARA PUXAR MEUS DADOS 

function getMyData () {
  fetch("/MyProfile", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myBlob) {
      console.log(myBlob)
      if (myBlob.success) {
          Cookies.remove('meusDados')
          Cookies.remove('dadosMeusPets')
          Cookies.remove('minhasPostagens')
          Cookies.set("meusDados", myBlob.meusDados)
          Cookies.set("dadosMeusPets", myBlob.dadosMeusPets)
          Cookies.set("minhasPostagens", myBlob.minhasPostagens)

          document.getElementById("userImage").src = `${myBlob.meusDados.userPicture}`
      }else {
       
      }
    })
}



getMyData();





//CODIGO DO CHAT EM TEMPO REAL, MANUNTENÇÕES FALAR COM LUCAS.


const socket = io();

socket.on('sendMessage', (msg) => {
  receberMensagem(msg)
})


function receberMensagem(mensagem) {
  var chatBody = document.getElementById("chat-body");
  var chatImage = document.getElementById("chat-image").files[0];

  // Adiciona a mensagem de texto ao chat

  var mensagemTexto = document.createElement("p");
  mensagemTexto.setAttribute("idmensagem",mensagem.idMensagem)

  if(mensagem.messageSender !== 'Lucas') {
    mensagemTexto.textContent = mensagem.messageSender + ": " + mensagem.message;
    chatBody.appendChild(mensagemTexto);
  }else {
    mensagemTexto.textContent = "Você: " + mensagem.message;
    chatBody.appendChild(mensagemTexto);
  }
  


  // Limpa os campos de entrada após o envio
  document.getElementById("chat-input").value = "";

}


// chat
function enviarMensagem() {
  var chatBody = document.getElementById("chat-body");
  var chatInput = document.getElementById("chat-input").value;
  var chatImage = document.getElementById("chat-image").files[0];

  // Adiciona a mensagem de texto ao chat
  if (chatInput) {
    const storageContact = JSON.parse(localStorage.getItem('talkingNow'))

    fetch("/EnviaMensagem", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "IDContato": storageContact.contactID,
        "Texto": chatInput
      })
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myBlob) {
        if (myBlob.success) {
          const dataMessage = { contatoID: storageContact.contactID, messageText: chatInput, myName: 'Lucas', idMensagem:myBlob.idMensagem }
          socket.emit('sendMessage', dataMessage)
          let mensagemTexto = document.createElement("p");
          mensagemTexto.id = myBlob.idMensagem
          chatBody.appendChild(mensagemTexto);
        }else {
          let Mensagem = {messageSender:"SERVIDOR", message:"não foi possivel enviar a mensagem solicitada"}
          receberMensagem(Mensagem)
        }

      })

  }
  // Limpa os campos de entrada após o envio
  document.getElementById("chat-input").value = "";
  // document.getElementById("chat-image").value = "";
}


function toggleList(list) {
  const amigosList = document.getElementById('amigos');
  const interessadosList = document.getElementById('interessados');

  if (list === 'amigos') {
    amigosList.classList.add('active');
    interessadosList.classList.remove('active');
  } else {
    interessadosList.classList.add('active');
    amigosList.classList.remove('active');
  }
}

function abrirChat(dataUsers) {

  document.getElementById('chat-body').innerHTML = ''
  localStorage.clear('talkingNow')

  localStorage.setItem('talkingNow', JSON.stringify({ contactID: dataUsers.id, nameUser: dataUsers.className }))
  fetch(`/MensagensContato/${dataUsers.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myBlob) {
      console.log(myBlob)
      let mensagem = {}
      if (myBlob.success) {
        myBlob.messages.forEach(e => {
          if(e.quemEnviouAMensagem === 'Enviado pelo contato') {
            mensagem.messageSender = dataUsers.className
            mensagem.message = e.Texto
            mensagem.idMensagem = e.IDMensagem
          }else {
            mensagem.messageSender = 'Você'
            mensagem.message = e.Texto
            mensagem.idMensagem = e.IDMensagem
          }
          receberMensagem(mensagem)
        })
        document.getElementById('chat-nome').innerText = dataUsers.className;
        document.getElementById('chat-box').style.display = 'block';
        const contactID = myBlob.contactID
        socket.emit('chatInject', contactID)
      }else if (myBlob.error === "não possui nenhuma mensagem com o contato especificado") {
        document.getElementById('chat-nome').innerText = dataUsers.className;
        document.getElementById('chat-box').style.display = 'block';
        const contactID = myBlob.contactID
        socket.emit('chatInject', contactID)
      }else {
        mensagem.message = "Você não pode ver mensagens deste contato, tente novamente"
        mensagem.messageSender = "Servidor"
        receberMensagem(mensagem)
      }
    });

}

function fecharChat() {
  localStorage.clear('talkingNow')
  document.getElementById('chat-box').style.display = 'none';
}



