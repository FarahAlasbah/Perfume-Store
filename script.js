$(document).ready(function () {
    // Scroll to Top Functionality
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $("#scrollToTop").fadeIn();
        } else {
            $("#scrollToTop").fadeOut();
        }
    });

    $("#scrollToTop").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
    });

    // Load products dynamically in product.html
    if ($("#products-container").length > 0) {
        $.ajax({
            url: "products.json",
            method: "GET",
            dataType: "json",
            success: function (data) {
                renderProducts(data);

                // Search bar functionality
                $("#productSearch").on("input", function () {
                    const searchTerm = $(this).val().toLowerCase();
                    const filteredProducts = data.filter((product) =>
                        product.name.toLowerCase().includes(searchTerm)
                    );
                    renderProducts(filteredProducts);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error fetching products:", error);
            },
        });
    }

    // Render products
    function renderProducts(products) {
        let productsHTML = "";
        products.forEach((product) => {
            productsHTML += `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>${product.price}</p>
                    <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
                </div>
            `;
        });
        $("#products-container").html(productsHTML);

        // Attach event listeners for "Add to Cart" buttons
        $(".add-to-cart").on("click", function () {
            const productName = $(this).data("name");
            const productPrice = parseFloat($(this).data("price").replace("$", ""));
            const productImage = $(this).data("image");
            addToCart(productName, productPrice, productImage);
        });
        
    }

    // Shopping Cart Functionality
    function addToCart(productName, productPrice, productImage) {
        let cart = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart from localStorage
        const existingItem = cart.find(item => item.name === productName);
    
        if (existingItem) {
            existingItem.quantity += 1; // Increase quantity if item exists
        } else {
            cart.push({ name: productName, price: productPrice, image: productImage, quantity: 1 }); // Add new item
        }
    
        localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
        updateCartCount(); // Update the cart count
        showCustomAlert("Item added to cart!"); // Optional alert
        
    }

    // Load cart items in cart.html
    if ($("#cart-items").length > 0) {
        renderCart();
    }
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let cartHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <span class="product-name">${item.name}</span>
                       
                        <span class="product-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn-minus-btn">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn-plus-btn">+</button>
                    </div>
                    <button class="remove-item">Remove</button>
                </div>
            `;
        });


        $("#cart-items").html(cartHTML);
        $("#cart-total").text(`Total: $${total.toFixed(2)}`);

        // Attach event listeners for increase, decrease, and remove buttons
        $(".quantity-btn-plus-btn").on("click", function () {
            const index = $(this).parent().parent().data("index");
            updateQuantity(index, 1);
            updateCartCount();
        });

        $(".quantity-btn-minus-btn").on("click", function () {
            const index = $(this).parent().parent().data("index");
            updateQuantity(index, -1);
            updateCartCount();
        });

        $(".remove-item").on("click", function () {
            const index = $(this).parent().parent().data("index");
            removeItem(index);
        });
    }

    function updateQuantity(index, change) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart[index]) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        }
    }

    function removeItem(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }

    // Clear Cart Functionality
    $("#clear-cart").click(function () {
        showCustomAlert("Cart cleared!");
        localStorage.removeItem("cart");
        renderCart();
        updateCartCount(); // Reset the cart badge count
    });
    $("#checkout").click(function () {
        showCustomAlert("Thank you for shopping with us! Your order has been placed.");
        localStorage.removeItem("cart");
        renderCart();
        updateCartCount();
    });

    function showCustomAlert(message) {
        const alertBox = $('<div class="custom-alert"></div>').text(message);
        $("body").append(alertBox);
        setTimeout(() => {
            alertBox.fadeOut(500, () => {
                alertBox.remove();
            });
        }, 3000);
    }

    
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total items
    document.getElementById('cart-count').textContent = itemCount; // Update the cart count
}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize the cart count on page load
    updateCartCount();

    // Example: Adding click event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price').replace('$', ''));
            const productImage = button.getAttribute('data-image');

            addToCart(productName, productPrice, productImage);
        });
    });

});

