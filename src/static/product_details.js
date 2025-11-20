document.addEventListener('DOMContentLoaded', prepareHandlers);

const el = {};

// Prepare the handlers for the elements on the page.
function prepareHandlers() {
    el.urlParams = new URLSearchParams(window.location.search);
    el.product = el.urlParams.get('id');
    console.log(el.product);
    loadProductDetails();
}

// Load the product details from the server.
async function loadProductDetails() {
    try {
        const response = await fetch(`products/${el.product}`);
        el.data = await response.json();
    } catch (error) {
        console.error("Failed to load product details:", error);
    }

    document.querySelector(".product-image").textContent = el.data.image;
    document.querySelector(".product-name").textContent = el.data.name;
    document.querySelector(".product-type").textContent = `Product Type: ${el.data.product_type}`;
    document.querySelector(".skin-type").textContent = `Skin Type: ${el.data.skin_type}`;
    document.querySelector(".ingredients").textContent = `Ingredients: ${el.data.ingredients}`;
}
