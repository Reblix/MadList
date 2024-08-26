document.addEventListener('DOMContentLoaded', loadWishlist);

function loadWishlist() {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistElement = document.getElementById('wishlist-items');
    
    wishlistElement.innerHTML = '';
    wishlistItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'wishlist-item';
        li.onclick = () => redirectToDetailsPage(item.id);
        li.innerHTML = `
            <img src="${item.image ? item.image : 'placeholder.jpg'}" alt="${item.title ? item.title : ''}">
            <div class="item-details">
                <h3>${item.title ? item.title : ''}</h3>
            </div>
        `;
        wishlistElement.appendChild(li);
    });
}

function showForm() {
    document.getElementById('itemForm').style.display = 'block';
}

function closeForm() {
    document.getElementById('itemForm').style.display = 'none';
}

function addNewItem() {
    const title = document.getElementById('itemTitle').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const link = document.getElementById('itemLink').value.trim();
    const imageInput = document.getElementById('itemImage');
    const image = imageInput.files[0];

    if (title && description && image) {
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

        reader.readAsDataURL(image);
    } else {
        alert('Tem que preencher todos os campos obrigatórios minha senhora');
    }
}

function redirectToDetailsPage(itemId) {
    window.location.href = `details.html?id=${itemId}`;
}
