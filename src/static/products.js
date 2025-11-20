import { Product } from "./productClass.js";

export const el = {};

let allProducts = [];

// When the page is loaded, prepare event handlers and load the products
async function pageLoaded() {
  prepareHandlers();
  addEventListeners();
  await Product.loadProductTemplate();
  loadProducts();
}
pageLoaded();

/// Prepare the handlers for the elements on the page.
function prepareHandlers() {
  el.productList = document.querySelector(".productList");
  el.skinTypeFilter = document.querySelector("#skinType");
  el.productTypeFilter = document.querySelector("#productType");

}

function addEventListeners() {
  el.skinTypeFilter.addEventListener("change", filterProducts);
  el.productTypeFilter.addEventListener("change", filterProducts);
}

// Load the products from the server.
async function loadProducts() {
  try {
    const response = await fetch("products");
    if (response.ok) {
      allProducts = await response.json();
    } else {
      allProducts = [{
        id: 0,
        name: "Error loading products",
        product_type: "",
        skin_type: "",
        ingredients: ""
      }];
    }

    showProducts(allProducts);
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// Show the products on the page using the Product class.
function showProducts(products) {
  // For each product, create a new Product card using the template.
  for (const product of products) {
    new Product(product, el.productList, "redirecting");
  
  }
}

function filterProducts() {
  const selectedSkinType = el.skinTypeFilter.value.toLowerCase();
  const selectedProductType = el.productTypeFilter.value.toLowerCase();

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const skinTypeMatch =
      selectedSkinType === "all" ||
      product.skin_type.toLowerCase().includes(selectedSkinType);

    const productTypeMatch =
      selectedProductType === "all" ||
      product.product_type.toLowerCase() === selectedProductType;

    return skinTypeMatch && productTypeMatch;
  });

  // Clear current product list
  el.productList.textContent = "";

  // Show only the filtered products
  showProducts(filteredProducts);
}