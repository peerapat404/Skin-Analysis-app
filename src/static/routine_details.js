import { Product } from "./productClass.js";

export const glob = {};
let allProducts = [];

document.addEventListener('DOMContentLoaded', prepareHandlers);

/// Prepare the handlers for the elements on the page.
async function prepareHandlers() {
    glob.urlParams = new URLSearchParams(window.location.search);
    glob.routine = glob.urlParams.get('id');
    glob.predefined = glob.urlParams.get('predefined');
    glob.showProductForm = document.querySelector("#showProductForm");
    glob.addProductForm = document.querySelector("#addProductForm");
    glob.addProduct = document.querySelector("#addProduct");
    glob.closeProductForm = document.querySelector("#closeProductForm");
    glob.listOfProducts = document.querySelector(".listOfProducts");
    
    await Product.loadProductTemplate(); 
    await loadProducts();
    
    determineRoutineType();
    addEventListeners();
}

/// Determine if the routine is predefined or user-created and load the appropriate data.
function determineRoutineType() {
    if (glob.predefined === 'true') {
        loadPredefinedRoutines();
    } else {
        loadRoutineDetails();
    }
}

/// Load the products from the server.
async function loadProducts() {
    try {
        const response = await fetch("/products");
        if (!response.ok) {
            throw new Error("Failed to load products.");
        }
        allProducts = await response.json();
        showProducts(allProducts, glob.listOfProducts, "selecting");
        populateProductTypeSelect();
    } catch (error) {
        console.error("Failed to load products:", error);
    }
}

/// Load the predefined routines based on the selected skin type.
async function loadPredefinedRoutines() {
    try {
        const response = await fetch(`/predefined-routines/${glob.routine}`);
        if (!response.ok) {
            throw new Error("Failed to load predefined routines.");
        }

        glob.predefinedRoutine = await response.json();

        document.querySelector(".routineName").textContent = 
        `
            ${glob.predefinedRoutine.time.charAt(0).toUpperCase() + glob.predefinedRoutine.time.slice(1).toLowerCase()} 
            Routine For 
            ${glob.predefinedRoutine.skin_type.charAt(0).toUpperCase() + glob.predefinedRoutine.skin_type.slice(1).toLowerCase()} 
            Skin
        `;

        glob.productList = document.querySelector("#productList");
        glob.showProductForm.style.display = "none";

        showProducts(glob.predefinedRoutine.products, glob.productList, "display");

    } catch (error) {
        console.error("Failed to load predefined routines:", error);
    }
}

/// Load the details of a user-created routine.
async function loadRoutineDetails() {
    try {
        const response = await fetch(`/routines/${glob.routine}`);
        if (!response.ok) {
            throw new Error("Failed to fetch routine details.");
        }

        glob.data = await response.json();
        document.querySelector(".routineName").textContent = glob.data.routine_name;
        glob.productList = document.querySelector("#productList");
        glob.productList.textContent = "";

        if (glob.data.product_names) {
            const productNames = glob.data.product_names.split(", ").map(p => p.trim());
            const productsToShow = allProducts.filter(p => productNames.includes(p.name));

            showProducts(productsToShow, glob.productList, "display");
        }

    } catch (error) {
        console.error("Failed to load routine details:", error);
    }
}

// Show the add product form when the button is clicked.
function showProducts(products, container, type){
    for (const product of products) {
        new Product(product, container, type);
    }
}

// Populate the product type.
function populateProductTypeSelect() {
    const productTypeSelect = document.querySelector("#productTypeSelect");
    productTypeSelect.textContent = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Product Types";
    productTypeSelect.appendChild(defaultOption);

    // Get unique product types from all products and sort them
    const productTypes = Array.from(
        new Set(allProducts.map(p => p.product_type.trim().toLowerCase())) // Convert the product types to lowercase and trim whitespace.

    ).sort();

    productTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        productTypeSelect.appendChild(option);
    });

    productTypeSelect.addEventListener("change", (event) => {
        filterProductsByType(event.target.value);
    });
}

/// Filter products based on the selected product type.
function filterProductsByType(selectedType) {
    glob.listOfProducts.textContent = "";

    const filteredProducts = selectedType
        ? allProducts.filter(p => p.product_type.toLowerCase() === selectedType.toLowerCase())
        : allProducts;

    showProducts(filteredProducts, glob.listOfProducts, "selecting");
}

/// Add event listeners to the buttons.
function addEventListeners() {
    glob.showProductForm.addEventListener("click", showAddProductForm);
    glob.closeProductForm.addEventListener("click", hideAddProductForm);
}

// Show the add product form.
function showAddProductForm() {
    glob.addProductForm.classList.remove("hidden");
}

/// Hide the add product form.
export function hideAddProductForm() {
    glob.addProductForm.classList.add("hidden");
}


