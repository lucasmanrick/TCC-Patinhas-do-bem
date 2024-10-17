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


function viewProfile() {
    window.location.href = '/path/to/profile'; // Altere o caminho conforme necessário
}

function logOff() {
    window.location.href = '/logout'; // Altere o caminho conforme necessário
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
    const postsContainer = document.getElementById('posts-container');

    // Verifica se os campos não estão vazios
    if (title.trim() === '' || content.trim() === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Cria um novo elemento de postagem
    const post = document.createElement('div');
    post.classList.add('post');

    // Adiciona o conteúdo da postagem
    post.innerHTML = `
        <h4>${title}</h4>
        <p>${content}</p>
    `;

    // Adiciona a postagem ao container
    postsContainer.prepend(post); // Insere no início para mostrar as mais recentes primeiro

    // Limpa os campos de entrada
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
}

function openPublishModal() {
    document.getElementById('publish-modal').style.display = 'block';
}

function closePublishModal() {
    document.getElementById('publish-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('publish-modal');
    if (event.target === modal) {
        closePublishModal();
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





    


