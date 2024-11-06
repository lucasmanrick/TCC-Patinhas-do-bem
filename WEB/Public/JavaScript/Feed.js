


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



const inputs = document.querySelectorAll('.animal');
const btnSalvar = document.querySelector('.btn-salvar');

inputs.forEach(input => {
  input.addEventListener('input', () => {
    btnSalvar.disabled = !Array.from(inputs).every(input => input.value.trim() !== '');
  });
});




// Evento para o botão Curtir
document.querySelector('.like-button').addEventListener('click', function () {
  alert('Você curtiu a postagem!');
});

// Evento para o botão Comentar
document.querySelector('.submit-comment').addEventListener('click', function () {
  const comment = document.querySelector('.comment-input').value;
  if (comment) {
    alert('Comentário enviado: ' + comment);
    document.querySelector('.comment-input').value = ''; // Limpa o campo de comentário
  } else {
    alert('Por favor, escreva um comentário.');
  }
});


// Evento para o botão Publicar comentário
document.querySelector('.submit-comment').addEventListener('click', function () {
  const comment = document.querySelector('.comment-input').value;
  if (comment) {
    alert('Comentário enviado: ' + comment);
    document.querySelector('.comment-input').value = ''; // Limpa o campo de comentário
  } else {
    alert('Por favor, escreva um comentário.');
  }
});



//CONSUMO DE APIS 


//MEUS DADOS
function getMyData() {
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

      if (myBlob.success) {
        Cookies.remove('usuarioLogado')
        Cookies.remove('imagemUsuario')
        Cookies.remove("usuarioID")



        Cookies.set("usuarioLogado", myBlob.meusDados.Nome)
        Cookies.set("usuarioID", myBlob.meusDados.ID)

        Cookies.set("imagemUsuario", myBlob.meusDados.UserPicture)

        document.getElementById("userImage").src = `${myBlob.meusDados.UserPicture}`
        document.getElementById("userNameContent").innerText = `${myBlob.meusDados.Nome}`
      } else {

      }
    })
}



getMyData();





//CODIGO DO CHAT EM TEMPO REAL, MANUNTENÇÕES FALAR COM LUCAS.

//ENVIAR MENSAGEM E PUXAR MENSAGENS COM UM CONTATO
const socket = io();

socket.on('sendMessage', (msg) => {
  receberMensagem(msg)
})


function receberMensagem(mensagem) {
  var chatBody = document.getElementById("chat-body");
  var chatImage = document.getElementById("chat-image").files[0];

  // Adiciona a mensagem de texto ao chat

  var mensagemTexto = document.createElement("p");
  mensagemTexto.setAttribute("idmensagem", mensagem.idMensagem)



  if (mensagem.myID !== Cookies.get('usuarioID')) {
    mensagemTexto.textContent = mensagem.messageSender + ": " + mensagem.message;
    chatBody.appendChild(mensagemTexto);
  } else {
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
          const dataMessage = { contatoID: storageContact.contactID, messageText: chatInput, messageSender: Cookies.get("usuarioLogado"), myID: Cookies.get("usuarioID"), idMensagem: myBlob.idMensagem }
          socket.emit('sendMessage', dataMessage)
          let mensagemTexto = document.createElement("p");
          mensagemTexto.id = myBlob.idMensagem
          chatBody.appendChild(mensagemTexto);
        } else {
          let Mensagem = { messageSender: "SERVIDOR", message: "não foi possivel enviar a mensagem solicitada" }
          receberMensagem(Mensagem)
        }

      })

  }
  // Limpa os campos de entrada após o envio
  document.getElementById("chat-input").value = "";
  // document.getElementById("chat-image").value = "";
}


function toggleList(list) {
  const amigosList = document.getElementById('listContent');
  const interessadosList = document.getElementById('interestedContent');

  if (list === 'amigos') {
    amigosList.style = `display:block`
    interessadosList.style = `display:none`
  } else {
    amigosList.style = `display:none`
    interessadosList.style = `display:block`
  }
}

function abrirChat(dataUsers) {
  console.log(dataUsers)
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
          if (e.quemEnviouAMensagem === 'Enviado pelo contato') {
            mensagem.messageSender = dataUsers.className
            mensagem.message = e.Texto
            mensagem.idMensagem = e.IDMensagem
          } else {
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
      } else if (myBlob.error === "não possui nenhuma mensagem com o contato especificado") {
        document.getElementById('chat-nome').innerText = dataUsers.className;
        document.getElementById('chat-box').style.display = 'block';
        const contactID = myBlob.contactID
        socket.emit('chatInject', contactID)
      } else {
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





// PUXANDO ANIMAIS QUE ESTÃO PARA ADOÇÃO.

let petGap = 0;
let postGap = 0;


async function getingPets() {
  await fetch(`/PetsAdocao`, {
    method: 'POST',
    body: JSON.stringify({ 'gapQuantity': petGap }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myBlob) {
      if (myBlob.success) {
        console.log(myBlob, "chegou aki")
        myBlob.dataResponse.forEach(e => {
          petGap = petGap + 1
          // const mainDiv = document.createElement('div')
          // mainDiv.className = "post"
          // mainDiv.id = e.petID

          // const divpetInfo = document.createElement('div')
          // divpetInfo.className = "user-info"

          // const divTitle = document.createElement('div')
          // divTitle.className = "titulo-pet"


          // const pContext = document.createElement('p');
          // pContext.innerText = "Informações do pet"

          // const formDiv = document.createElement('div')
          // formDiv.className = "formulario-do-pet";

          // const pType = document.createElement('p');
          // pType.className = "descrição"
          // pType.innerHTML = `<strong>Tipo de Animal:</strong> ${e.TipoAnimal}`

          // const pLine = document.createElement('p');
          // pLine.className = "descrição"
          // pLine.innerHTML = `<strong>Linhagem:</strong> ${e.Linhagem}`

          // const pAge = document.createElement('p');
          // pAge.className = "descrição"
          // pLine.innerHTML = `<strong>Idade:</strong>  ${e.Idade}`   

          // const pSex = document.createElement('p');
          // pSex.className = "descrição"
          // pSex.innerHTML = `<strong>Sexo:</strong> ${e.Sexo}`

          // const pColor = document.createElement('p');
          // pColor.className = "descrição"
          // pColor.innerHTML = `<strong>Cor:</strong> ${e.Cor}`

          // const pDescription = document.createElement('p');
          // pDescription.className = "descrição"
          // pDescription.innerHTML = `<strong>Descrição:</strong> ${e.Descricao}`

          // const divPhotoContent = document.createElement('div')
          // divPhotoContent.className = "animal-post"

          // divPhotoContent.innerHTML = `<img src="${e.petPicture}" alt="Imagem do animal" class="animal-photo">`





          // const buttonInterest = document.createElement("button")
          // buttonInterest.className = "btn-interesse"
          // buttonInterest.id = `interest-${e.petID}`
          // buttonInterest.onclick = showInterestOnPet(this)
          // buttonInterest.innerText = "Tenho Interesse"
          // formDiv.append(pType,pLine,pAge,pSex,pColor,pDescription)
          // divTitle.append(pContext)
          // divpetInfo.append(divTitle,formDiv,buttonInterest)
          // mainDiv.append(divpetInfo,divPhotoContent)
          // document.getElementById('view-animals-content').append(mainDiv)

          const divReceiver = document.createElement("div")
          divReceiver.id = "petsReceiver"
          document.getElementById('view-animals-content').append (divReceiver) 
          
          divReceiver.innerHTML = `
           <h2>Animais para adoção</h2> 
          <button style="padding: 10px; border: 1px solid;" onclick="getMyInterests()">Meus Interesses</button>
          <div class="post"">
            <div class="user-info">
              <div class="titulo-pet">
                <p>Informações do pet</p>
              </div>
  
              <div class="formulario-do-pet">
                <p class="descrição"><strong>Tipo de Animal:</strong> ${e.TipoAnimal}</p>
                <p class="descrição"><strong>Linhagem:</strong> ${e.Linhagem}</p>
                <p class="descrição"><strong>Idade:</strong>  ${e.Idade}</p>
                <p class="descrição"><strong>Sexo:</strong> ${e.Sexo}</p>
                <p class="descrição"><strong>Cor:</strong> ${e.Cor}</p>
                <p class="descrição"><strong>Local:</strong> ${e.Cidade} - ${e.Estado}</p>
                <p class="descrição"><strong>Descrição:</strong> ${e.Descricao}</p>
              </div>
              ${e.demonstrouInteresse === true ? `<button class="btn-interesse" style = "background-color:red" id="${e.petID}" onclick = "">Já demonstrou interesse</button>` : ` <button class="btn-interesse" id="${e.petID}" onclick = "showInterestOnPet(this)">Tenho Interesse</button>`}
             
            </div>
            <div class="animal-post">
              <img src="${e.petPicture}" alt="Imagem do animal" class="animal-photo">
            </div>
          </div>
      `


        })

      }

    })
}







//função para demonstrar interesse em um pet

async function showInterestOnPet(PetID) {
  console.log(PetID.id)
  fetch(`/DemonstrarInteressePet`, {
    method: 'POST',
    body: JSON.stringify({ 'PetID': PetID.id }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myBlob) {
      if (myBlob.success) {
        return alert("você demonstrou interesse no pet com sucesso, e enviou uma solicitação de amizade para o dono dele")
      } else if (myBlob.error) {
        alert(myBlob.error)
      }

    })
}




async function getingMyContacts() {
  await fetch(`/MeusContatos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myBlob) {
      if (myBlob.success) {
        if (myBlob.contatosDeInteresses.length >= 1) {
          myBlob.contatosDeInteresses.forEach(e => {
            document.getElementById('interestedContent').innerHTML = `
           <li id="${e.contatoID}" class="${e.Nome}" onclick="abrirChat(this)">
              <img class="img1" src="https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/perfil%2F${e.IDUsuario}.jpg?alt=media" alt="">
             ${e.Nome}
            </li>`
          })
        }

        if (myBlob.contatosSemInteresses.length >= 1)
          myBlob.contatosSemInteresses.forEach(e => {
            document.getElementById('listContent').innerHTML = `
          <li id="${e.contatoID}" class="${e.Nome}" onclick="abrirChat(this)">
             <img class="img1" src="https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/perfil%2F${e.IDUsuario}.jpg?alt=media" alt="">
            ${e.Nome}
           </li>`
          })
      } else if (myBlob.error) {
        console.error(myBlob.error)
      }
    })
}


async function getMyInterests() {
  await fetch(`/MeusInteresses`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myBlob) {
      if (myBlob.success) {
        myBlob.myInterests.forEach(e => {

          const divReceiver = document.createElement("div")
          divReceiver.id = "interestReceiver"
          document.getElementById('view-animals-content').append (divReceiver) 
          document.getElementById('view-animals-content').removeChild(document.getElementById('petsReceiver'))
          
          divReceiver.innerHTML = `
          <h2>Animais para adoção</h2> 
            <button style="padding: 10px; border: 1px solid;" onclick="getingPets">Animais para adoção</button>
              <div class="post"">
                <div class="user-info">
                  <div class="titulo-pet">
                    <p>Você demonstrou interesse</p>
                  </div>
      
                  <div class="formulario-do-pet">
                    <p class="descrição" onclick="perfilUser(${e.IDDoador})"><strong>Dono do pet:</strong> ${e.NomeDoDono}</p>
                    <p class="descrição"><strong>Tipo de Animal:</strong> ${e.TipoAnimal}</p>
                    <p class="descrição"><strong>Linhagem:</strong> ${e.Linhagem}</p>
                    <p class="descrição"><strong>Idade:</strong>  ${e.Idade}</p>
                    <p class="descrição"><strong>Sexo:</strong> ${e.Sexo}</p>
                    <p class="descrição"><strong>Cor:</strong> ${e.Cor}</p>
                    <p class="descrição"><strong>Local:</strong> ${e.Cidade} - ${e.Estado}</p>
                    <p class="descrição"><strong>Descrição:</strong> ${e.Descricao}</p>
                  </div>
                 
                </div>
                <div class="animal-post">
                  <img src="https://firebasestorage.googleapis.com/v0/b/patinhasdobem-f25f8.appspot.com/o/pets%${e.ID}F1.jpg?alt=media" alt="Imagem do animal" class="animal-photo">
                </div>
              </div>
            `
         
        })
      }
    })
}



async function perfilUser (userID) {
  Cookies.remove("perfilSendoVisto")
  Cookies.set("perfilSendoVisto", userID)
}


getingPets()
getingMyContacts()