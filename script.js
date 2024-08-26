document.addEventListener('DOMContentLoaded', loadWishlist);

function loadWishlist() {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistElement = document.getElementById('wishlist-items');
    
    wishlistElement.innerHTML = '';
    wishlistItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'wishlist-item';
        li.innerHTML = `
            <img src="${item.image ? item.image : 'placeholder.jpg'}" alt="${item.title ? item.title : ''}">
            <div class="item-details">
                <h3>${item.title ? item.title : ''}</h3>
            </div>
            <div class="item-actions">
                <button onclick="editItem('${item.id}')">Editar</button>
                <button onclick="deleteItem('${item.id}')">Excluir</button>
            </div>
        `;
        li.onclick = (e) => {
            if (!e.target.closest('.item-actions')) {
                redirectToDetailsPage(item.id);
            }
        };
        wishlistElement.appendChild(li);
    });
}

function showForm() {
    document.getElementById('formTitle').innerText = 'Adicionar novo item';
    document.getElementById('editingItemId').value = '';
    document.getElementById('itemTitle').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('itemLink').value = '';
    document.getElementById('itemImage').value = '';
    document.getElementById('itemForm').style.display = 'block';
}

function closeForm() {
    document.getElementById('itemForm').style.display = 'none';
}

function saveItem() {
    const id = document.getElementById('editingItemId').value;
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const link = document.getElementById('itemLink').value.trim();
    const imageInput = document.getElementById('itemImage');
    const imageFile = imageInput.files[0];

    if (!title || !description) {
        alert('Tem que preencher os campos obrigatórios minha senhora!');
        return;
    }

    if (id) {
        // Edit existing item
        editExistingItem(id, title, description, link, imageFile);
    } else {
        // Add new item
        addNewItem(title, description, link, imageFile);
    }
}

function addNewItem(title, description, link, imageFile) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const newItem = {
            id: Date.now().toString(),
            title: title,
            description: description,
            link: link || '#',
            image: event.target.result
        };

        const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlistItems.push(newItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        
        loadWishlist();
        closeForm();
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    } else {
        reader.onload({ target: { result: '' } });
    }
}

function editExistingItem(id, title, description, link, imageFile) {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    const itemIndex = wishlistItems.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        wishlistItems[itemIndex].title = title;
        wishlistItems[itemIndex].description = description;
        wishlistItems[itemIndex].link = link || '#';

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                wishlistItems[itemIndex].image = event.target.result;
                localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
                loadWishlist();
                closeForm();
            };
            reader.readAsDataURL(imageFile);
        } else {
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
            loadWishlist();
            closeForm();
        }
    }
}

function editItem(id) {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    const item = wishlistItems.find(item => item.id === id);

    if (item) {
        document.getElementById('formTitle').innerText = 'Editar item';
        document.getElementById('editingItemId').value = item.id;
        document.getElementById('itemTitle').value = item.title;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemLink').value = item.link;
        document.getElementById('itemForm').style.display = 'block';
    }
}

function deleteItem(id) {
    let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlistItems = wishlistItems.filter(item => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    
    loadWishlist();
}

function redirectToDetailsPage(itemId) {
    window.location.href = `details.html?id=${itemId}`;
}
