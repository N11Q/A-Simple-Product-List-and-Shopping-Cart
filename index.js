/* Shopping Cart */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    const cartItemsContainer = document.getElementsByClassName('cart-items')[0];
    if (!cartItemsContainer) {
        console.log("No cart found on this page. Skipping cart initialization.");
    } else {
        loadCartFromStorage();

        const removeCartItemButtons = document.getElementsByClassName('btn-danger');
        for (let button of removeCartItemButtons) {
            button.addEventListener('click', removeCartItem);
        }

        const quantityInputs = document.getElementsByClassName('cart-quantity-input');
        for (let input of quantityInputs) {
            input.addEventListener('change', quantityChanged);
        }

        document.getElementsByClassName('btn-purchase')[0]?.addEventListener('click', purchaseClicked);
    }

    const addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (let button of addToCartButtons) {
        button.addEventListener('click', addToCartClicked);
    }
}

function purchaseClicked() {
    alert('Thank you for your purchase!');
    const cartItems = document.getElementsByClassName('cart-items')[0];
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    localStorage.removeItem('cart');
    updateCartTotal();
}

function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    saveCartToStorage();
    updateCartTotal();
}

function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    saveCartToStorage();
    updateCartTotal();
}

function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement.parentElement;
    const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    const price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    const imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;

    addItemToCart(title, price, imageSrc);
    saveCartToStorage();
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
    const cartRow = document.createElement('tr');
    cartRow.classList.add('cart-row');
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title');

    for (let cartItemName of cartItemNames) {
        if (cartItemName.innerText === title) {
            alert('This item is already added to the cart!');
            return;
        }
    }

    const cartRowContents = `
        <td class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="50" height="50">
            <span class="cart-item-title">${title}</span>                  
        </td>
        <td class="cart-item cart-column">
            <span class="cart-price cart-column">${price}</span>
        </td>
        <td class="cart-item cart-column">
            <input class="cart-quantity-input" type="number" value="1" style="width: 50px">
            <button class="btn btn-danger" type="button">Remove</button>
        </td>`;
    
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);

    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

function updateCartTotal() {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    if (!cartItemContainer) {
        console.warn("No cart-items container found.");
        return;
    }

    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;

    for (let cartRow of cartRows) {
        const priceElement = cartRow.getElementsByClassName('cart-price')[0];
        const quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        const price = parseFloat(priceElement.innerText.replace('GHC ', '')) || 0;
        const quantity = quantityElement.value || 1;
        total += price * quantity;
    }

    total = Math.round(total * 100) / 100;
    const totalPriceElement = document.getElementsByClassName('cart-total-price')[0];
    if (totalPriceElement) {
        totalPriceElement.innerText = `GHC ${total}.00`;
    }
}


function saveCartToStorage() {
    const cartItems = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItems.getElementsByClassName('cart-row');
    const cartData = [];

    for (let cartRow of cartRows) {
        const title = cartRow.getElementsByClassName('cart-item-title')[0].innerText;
        const price = cartRow.getElementsByClassName('cart-price')[0].innerText;
        const imageSrc = cartRow.getElementsByClassName('cart-item-image')[0].src;
        const quantity = cartRow.getElementsByClassName('cart-quantity-input')[0].value;

        cartData.push({ title, price, imageSrc, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cartData));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) {
        console.log("No saved cart found in localStorage.");
        return;
    }

    const cartData = JSON.parse(savedCart);
    const cartItems = document.getElementsByClassName('cart-items')[0];
    if (!cartItems) {
        console.warn("Cart container not found. Skipping cart load.");
        return;
    }

    for (let item of cartData) {
        addItemToCart(item.title, item.price, item.imageSrc);
        const cartRows = document.getElementsByClassName('cart-row');
        const lastRow = cartRows[cartRows.length - 1];
        lastRow.getElementsByClassName('cart-quantity-input')[0].value = item.quantity;
    }
    updateCartTotal();
}
