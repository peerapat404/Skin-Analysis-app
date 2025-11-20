import { hideAddProductForm, glob } from "./routine_details.js"; 

// Product class to create product cards from product data.
export class Product {
  static productTemplate = null;

  static async loadProductTemplate() {
    try {
      const response = await fetch("template/product-template.html");
      const text = await response.text();
      
      // Create a temporary container for the fetched HTML.
      const templateDiv = document.createElement("div");
      templateDiv.innerHTML = text.trim();
      
      // Find the <template> element in the fetched HTML
      const templateEl = templateDiv.querySelector("template");
      if (!templateEl) {
        throw new Error("Template element not found in the fetched HTML.");
      }
      
      // Store the template globally for later use
      Product.productTemplate = templateEl;
    } catch (error) {
      console.error("Failed to load product template:", error);
    }
  }
    constructor(data, container, type) {
      // Save product properties from data
      this.data = data;
      this.id = data.product_id;
      this.name = data.name;
      this.product_type = data.product_type;
      this.skin_type = data.skin_type;
      this.ingredients = data.ingredients;
      this.container = container;
      this.type = type;

      if (!Product.productTemplate) {
        throw new Error("Product template not loaded.");
      }
      this.render();
    }

    render() {
      // Clone the product template
      const productClone = Product.productTemplate.content.cloneNode(true);
      
      // Find the product container inside the clone
      const productContainer = productClone.querySelector(".productContainer");
      if (!productContainer) {
        throw new Error("Product container not found in the template.");
      }
      
      // Set data and fill in the details from our product object
      productContainer.setAttribute("data-id", this.id);
      productContainer.querySelector(".product-name").textContent = this.name;
      productContainer.querySelector(".product-type").textContent = `Product Type: ${this.product_type}`;
      productContainer.querySelector(".skin-type").textContent = `Skin Type: ${this.skin_type}`;
      productContainer.querySelector(".ingredients").textContent = `Ingredients: ${this.ingredients}`;
      productContainer.querySelector(".ingredients").style.display = "none";   
      
      const imageEl = productContainer.querySelector(".product-image");
      if (this.type === "display" && imageEl) {
        imageEl.style.display = "none";
      }

      if (this.type === "display" && glob.predefined !== 'true') {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.addEventListener("click", async (event) => {
          event.stopPropagation();
          try {
            const response = await fetch(`/updateProducts/${glob.routine}/delete-product`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ product_id: this.id }),
            });
      
            if (!response.ok) throw new Error("Failed to delete product");
      
            // Remove this card from the DOM without refreshing the whole list
            const li = event.target.closest("li");
            li.remove();
      
          } catch (err) {
            console.error("Delete failed:", err);
          }
        });
      
        productContainer.appendChild(deleteBtn);
      }
      

      const wrapper = document.createElement("li");
      wrapper.appendChild(productContainer);

      // Append the filled-in product card to the product list container (the <ul>)
      this.container.appendChild(wrapper);
      
      if (this.type === "selecting") {
        productContainer.addEventListener("click", () => {
          this.addProductToRoutine() 
          this.addProduct()
      });
      }  else if (this.type === "redirecting") {
        productContainer.href = `product_details.html?id=${this.id}`;
      }
    }

    addProductToRoutine() {
      const container = document.querySelector("#productList");
      new Product(this.data, container, "display");
    }
    
    async addProduct() {
      try {
          const response = await fetch(`/add-product`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({product_id: this.id, routine_id: glob.routine }),
          });
  
          if (!response.ok) {
              throw new Error("Failed to add product.");
          }
  
          const updateRoutine = await response.json();
          hideAddProductForm();
      } catch (error) {
          console.error("Failed to add product:", error);
          alert("Failed to add product.");
      }
  }
  }