function showContent(menuId) {
    // Esconde todos os conteúdos
    document.getElementById('mural-content').style.display = 'none';
    document.getElementById('notifications-content').style.display = 'none';
    document.getElementById('view-animals-content').style.display = 'none';

    // Mostra o conteúdo selecionado
    if (menuId === 'mural') {
        document.getElementById('mural-content').style.display = 'block';
    } else if (menuId === 'notifications') {
        document.getElementById('notifications-content').style.display = 'block';
    } else if (menuId === 'view-animals') {
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



function showMessages(type) {
    const messagesContent = document.getElementById('messages-content');
    
    // Adiciona classe "loading" e fade out
    messagesContent.classList.remove('visible');
    messagesContent.innerHTML = '<p class="loading">Carregando...</p>';

    // Simula um tempo de carregamento e então exibe as mensagens com animação
    setTimeout(() => {
        if (type === 'friends') {
            messagesContent.innerHTML = "<ul><li>Amigo 1: Oi!</li><li>Amigo 2: Vamos sair hoje?</li></ul>";
        } else {
            messagesContent.innerHTML = "<ul><li>Mensagem do Sistema: Sua conta foi atualizada.</li><li>Mensagem 2: Novo evento disponível!</li></ul>";
        }
        
        // Adiciona a classe "visible" para o fade in
        messagesContent.classList.add('visible');
    }, 500); // Simula um pequeno delay de carregamento
}

