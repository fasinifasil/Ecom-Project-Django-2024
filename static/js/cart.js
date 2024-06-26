var updateBtns = document.getElementsByClassName('update-cart');

for (var i = 0; i < updateBtns.length; i++) {
    updateBtns[i].addEventListener('click', function () {
        var productId = this.dataset.product;
        var action = this.dataset.action;
        console.log('productId:', productId, 'action:', action);
        console.log('USER:', user);
        if (user === 'AnonymousUser') {
            addCookieItem(productId, action);
        } else {
            updateUserOrder(productId, action);
        }
    });
}

function addCookieItem(productId, action) {
    console.log('------- User not authenticated -----------');
    if (action == 'add') {
        if (cart[productId] === undefined) {
            cart[productId] = {'quantity': 1};
        } else {
            cart[productId]['quantity'] += 1;
        }
    }
    if (action == 'remove') {
        cart[productId]['quantity'] -= 1;
        if (cart[productId]['quantity'] <= 0) {
            console.log('Remove Item');
            delete cart[productId];
        }
    }
    console.log('Cart:', cart);
    document.cookie = 'cart=' + JSON.stringify(cart) + ';domain=;path=/';
    updateCartCount(); // Call the function to update cart count
}

function updateUserOrder(productId, action) {
    console.log('User is authenticated, sending data ...');
    var url = '/updateItem';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({'productId': productId, 'action': action})
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log('Data:', data);
        location.reload(); // Reload the page to update the cart count and item list
    });
}

function updateCartCount() {
    var cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        // Update the cart count displayed in the navigation bar
        cartTotalElement.textContent = Object.keys(cart).reduce((total, key) => total + cart[key].quantity, 0);
    }
}
