// function searchContent() {
//   const query = document.getElementById('search-input').value.toLowerCase();
//   const posts = document.querySelectorAll('.post'); // Selecione todos os posts

//   posts.forEach(post => {
//       const title = post.querySelector('.post-title') ? post.querySelector('.post-title').textContent.toLowerCase() : '';
//       const content = post.querySelector('.post-content') ? post.querySelector('.post-content').textContent.toLowerCase() : '';
//       const animalInfo = post.querySelector('.formulario-do-pet') ? post.querySelector('.formulario-do-pet').textContent.toLowerCase() : ''; // Para informações do pet
      
//       // Verifica se a busca está contida no título, no conteúdo ou nas informações do animal
//       if (title.includes(query) || content.includes(query) || animalInfo.includes(query)) {
//           post.style.display = 'block'; // Mostra o post se a busca corresponder
//       } else {
//           post.style.display = 'none'; // Esconde o post se não corresponder
//       }
//   });
// }


// function viewProfile() {
//   window.location.href = '/path/to/profile'; // Altere o caminho conforme necessário
// }

// function logOff() {
//   window.location.href = '/logout'; // Altere o caminho conforme necessário
// }



// function showContent(menuId) {
//   // Esconde todos os conteúdos
//   document.getElementById('mural-content').style.display = 'none';
//   document.getElementById('notifications-content').style.display = 'none';
//   document.getElementById('view-animals-content').style.display = 'none';
//   document.getElementById('Cadastrar-Pets').style.display = 'none'

//   // Mostra o conteúdo selecionado
//   if (menuId === 'mural') {
//       document.getElementById('mural-content').style.display = 'block';
//   } 
//   else if (menuId === 'notifications') {
//       document.getElementById('notifications-content').style.display = 'block';
//   } 
//   else if (menuId === 'Cadastro'){
//       document.getElementById('Cadastrar-Pets').style.display = 'block'
//   }
//   else if (menuId === 'view-animals') {
//       document.getElementById('view-animals-content').style.display = 'block';
//   }
  
// }



// function publishPost() {
//   const title = document.getElementById('post-title').value;
//   const content = document.getElementById('post-content').value;
//   const postsContainer = document.getElementById('posts-container');

//   // Verifica se os campos não estão vazios
//   if (title.trim() === '' || content.trim() === '') {
//       alert('Por favor, preencha todos os campos.');
//       return;
//   }

//   // Cria um novo elemento de postagem
//   const post = document.createElement('div');
//   post.classList.add('post');

//   // Adiciona o conteúdo da postagem
//   post.innerHTML = `
//       <h4>${title}</h4>
//       <p>${content}</p>
//   `;

//   // Adiciona a postagem ao container
//   postsContainer.prepend(post); // Insere no início para mostrar as mais recentes primeiro

//   // Limpa os campos de entrada
//   document.getElementById('post-title').value = '';
//   document.getElementById('post-content').value = '';
// }

// function openPublishModal() {
//   document.getElementById('publish-modal').style.display = 'block';
// }

// function closePublishModal() {
//   document.getElementById('publish-modal').style.display = 'none';
// }

// window.onclick = function(event) {
//   const modal = document.getElementById('publish-modal');
//   if (event.target === modal) {
//       closePublishModal();
//   }
// }



// function publishPost() {
//   const title = document.getElementById('post-title').value;
//   const content = document.getElementById('post-content').value;
//   const imageInput = document.getElementById('post-image');
//   const postsContainer = document.getElementById('posts-container');

//   if (title && content) {
//       const postDiv = document.createElement('div');
//       postDiv.className = 'post';

//       // Adiciona o título
//       const postTitle = document.createElement('h4');
//       postTitle.innerText = title;
//       postDiv.appendChild(postTitle);

//       // Adiciona a imagem, se houver
//       if (imageInput.files && imageInput.files[0]) {
//           const img = document.createElement('img');
//           img.src = URL.createObjectURL(imageInput.files[0]);
//           img.style.width = '100%'; // Ajusta a largura da imagem
//           img.style.maxWidth = '500px'; // Largura máxima
//           postDiv.appendChild(img);
//       }

//       // Adiciona o conteúdo
//       const postContent = document.createElement('p');
//       postContent.innerText = content;
//       postDiv.appendChild(postContent);

//       // Adiciona a nova postagem ao container
//       postsContainer.prepend(postDiv); // Adiciona ao início da lista de postagens

//       // Limpa os campos
//       document.getElementById('post-title').value = '';
//       document.getElementById('post-content').value = '';
//       imageInput.value = ''; // Limpa o campo de imagem

//       closePublishModal(); // Fecha o modal
//   } else {
//       alert('Por favor, preencha todos os campos!');
//   }
// }
// let currentChatUser = '';



// const inputs = document.querySelectorAll('.animal');
//   const btnSalvar = document.querySelector('.btn-salvar');

//   inputs.forEach(input => {
//       input.addEventListener('input', () => {
//           btnSalvar.disabled = !Array.from(inputs).every(input => input.value.trim() !== '');
//       });
//   });




// // Evento para o botão Curtir
// document.querySelector('.like-button').addEventListener('click', function() {
//   alert('Você curtiu a postagem!');
// });

// // Evento para o botão Comentar
// document.querySelector('.submit-comment').addEventListener('click', function() {
//   const comment = document.querySelector('.comment-input').value;
//   if(comment) {
//       alert('Comentário enviado: ' + comment);
//       document.querySelector('.comment-input').value = ''; // Limpa o campo de comentário
//   } else {
//       alert('Por favor, escreva um comentário.');
//   }
// });

// // Evento para o botão Tenho Interesse
// document.querySelector('.interest-button').addEventListener('click', function() {
//   alert('Você demonstrou interesse!');
// });


// // Evento para o botão Curtir
// document.querySelector('.like-button').addEventListener('click', function() {
//   alert('Você curtiu a postagem!');
// });

// // Evento para o botão Comentar
// document.querySelector('.comment-button').addEventListener('click', function() {
//   const commentSection = document.querySelector('.comment-section');
//   // Verifica se a seção de comentário está visível ou não
//   if (commentSection.style.display === 'none' || commentSection.style.display === '') {
//       commentSection.style.display = 'flex'; // Exibe a seção de comentário
//   } else {
//       commentSection.style.display = 'none'; // Oculta a seção de comentário
//   }
// });

// // Evento para o botão Publicar comentário
// document.querySelector('.submit-comment').addEventListener('click', function() {
//   const comment = document.querySelector('.comment-input').value;
//   if(comment) {
//       alert('Comentário enviado: ' + comment);
//       document.querySelector('.comment-input').value = ''; // Limpa o campo de comentário
//   } else {
//       alert('Por favor, escreva um comentário.');
//   }
// });

// // Evento para o botão Tenho Interesse









// // Função para abrir o modal
// function openPublishModal() {
//   document.getElementById('publish-modal').style.display = 'block';
// }

// // Função para fechar o modal
// function closePublishModal() {
//   document.getElementById('publish-modal').style.display = 'none';
// }

// // Função para criar a publicação
// function publishPost() {
//   // Captura os valores dos campos
//   const postTitle = document.getElementById('post-title').value;
//   const postContent = document.getElementById('post-content').value;
//   const postImageInput = document.getElementById('post-image');
//   const postImage = postImageInput.files[0] ? URL.createObjectURL(postImageInput.files[0]) : '';

//   // Verifica se os campos estão preenchidos
//   if (postTitle === '' || postContent === '') {
//       alert('Preencha todos os campos.');
//       return;
//   }

//   // Cria o container da nova publicação
//   const postContainer = document.createElement('div');
//   postContainer.classList.add('feed-post');



//   // Adiciona a nova publicação ao container de posts
//   document.getElementById('posts-container').appendChild(postContainer);

//   // Fecha o modal após a publicação
//   closePublishModal();

//   // Limpa os campos do modal
//   document.getElementById('post-title').value = '';
//   document.getElementById('post-content').value = '';
//   document.getElementById('post-image').value = '';
// }

// // Evento para o botão Comentar
// document.addEventListener('click', function(event) {
//   if (event.target && event.target.classList.contains('comment-button')) {
//       const commentSection = event.target.closest('.feed-post').querySelector('.comment-section');
//       if (commentSection.style.display === 'none' || commentSection.style.display === '') {
//           commentSection.style.display = 'flex';
//       } else {
//           commentSection.style.display = 'none';
//       }
//   }
// });

// // Evento para o botão Curtir
// document.addEventListener('click', function(event) {
//   if (event.target && event.target.classList.contains('like-button')) {
//       alert('Você curtiu a postagem!');
//   }
// });










// function toggleMenu(event) {
//   const menu = event.target.nextElementSibling;
//   menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
// }

// function reportPost() {
//   alert('Postagem denunciada!');
//   // Aqui você pode adicionar a lógica para denunciar a postagem
// }

// // Fecha o menu se clicar fora dele
// window.onclick = function(event) {
//   if (!event.target.matches('.dots-button')) {
//       const menus = document.querySelectorAll('.menu');
//       menus.forEach(menu => menu.style.display = 'none');
//   }
// };



// function abrirChat(contatoID) {
//   console.log(contatoID)
// }