function displaySingleProduct(product) {
    const productsContainer = document.getElementById('product-container');

    const productCard = document.createElement('div');
    productCard.classList.add('relative', 'm-10', 'flex', 'w-full', 'max-w-xs', 'flex-col', 'overflow-hidden', 'rounded-lg', 'border', 'border-gray-100', 'bg-white', 'shadow-md');

    productCard.setAttribute("data-product-id", product.id);

    productCard.innerHTML = `
    <a class="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
      <img class="object-cover w-full h-full" src="${product.image}" alt="${product.title}" />
      <span class="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">${product.id}</span>
    </a>
    <div class="mt-4 px-5 pb-5">
      <a href="#">
        <h5 class="text-xl tracking-tight text-slate-900">${product.title}</h5>
      </a>
      <div class="mt-2 mb-5 flex items-center justify-between">
        <p>
          <span class="text-3xl font-bold text-slate-900">$${product.price}</span>
        </p>
      </div>
       <button class="update-button bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">Update</button>
      <button class="delete-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Delete</button>
    </div>
  `;
    productCard.querySelector('.update-button').addEventListener('click', () => openUpdateModal(product));
    productCard.querySelector('.delete-button').addEventListener('click', () => {
        deleteProduct(product.id, productCard);
    });

    productsContainer.prepend(productCard);
}


document.getElementById("productForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Capture form data
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;
    const category = document.getElementById("category").value;

    // Create product using API
    fetch('https://fakestoreapi.com/products', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            price: price,
            description: description,
            image: image,
            category: category
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Product created:", data);
            alert("Product added successfully!");
            displaySingleProduct(data);
            document.getElementById("productForm").reset(); // Clear the form
        })
        .catch(error => console.error("Error:", error));
});



async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error("Network response was not ok");

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
}

// Function to render products on the page
function displayProducts(products) {
    const productsContainer = document.getElementById('product-container');
    productsContainer.innerHTML = ''; // Clear previous products

    products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('relative', 'm-10', 'flex', 'w-full', 'max-w-xs', 'flex-col', 'overflow-hidden', 'rounded-lg', 'border', 'border-gray-100', 'bg-white', 'shadow-md');

        productCard.setAttribute("data-product-id", product.id); // Set product ID for identification

        productCard.innerHTML = `
      <a class="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
        <img class="object-cover w-full h-full" src="${product.image}" alt="${product.title}" />
        <span class="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">${product.id}</span>
      </a>
      <div class="mt-4 px-5 pb-5">
        <a href="#">
          <h5 class="text-xl tracking-tight text-slate-900">${product.title}</h5>
        </a>
        <div class="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span class="text-3xl font-bold text-slate-900">$${product.price}</span>
          </p>
        </div>
         <button class="update-button bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded">Update</button>
        <button class="delete-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Delete</button>
      </div>
    `;
        productCard.querySelector('.update-button').addEventListener('click', () => openUpdateModal(product));
        productCard.querySelector('.delete-button').addEventListener('click', () => {
            deleteProduct(product.id);
        });

        productsContainer.appendChild(productCard);
    });
}

// Function to delete product from the DOM
async function deleteProduct(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    fetch(`https://fakestoreapi.com/products/${productId}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(json => {
            console.log('Deleted product:', json);
            // Remove the product card from the DOM
            productCard.remove();
        })
        .catch(error => console.error("Error deleting product:", error));
}

function openUpdateModal(product) {
    document.getElementById('updateProductId').value = product.id;
    document.getElementById('updateTitle').value = product.title;
    document.getElementById('updatePrice').value = product.price;
    document.getElementById('updateDescription').value = product.description;
    document.getElementById('updateImage').value = product.image;
    document.getElementById('updateCategory').value = product.category;

    document.getElementById('updateModal').classList.remove('hidden');
}

// Close the modal when clicking outside or after update
document.getElementById('updateModal').addEventListener('click', (event) => {
    if (event.target === document.getElementById('updateModal')) {
        document.getElementById('updateModal').classList.add('hidden');
    }
});

document.getElementById('updateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const productId = document.getElementById('updateProductId').value;
    const updatedProduct = {
        id: productId,
        title: document.getElementById('updateTitle').value,
        price: parseFloat(document.getElementById('updatePrice').value),
        description: document.getElementById('updateDescription').value,
        image: document.getElementById('updateImage').value,
        category: document.getElementById('updateCategory').value
    };

    deleteProduct(productId);
    displaySingleProduct(updatedProduct);

    fetch(`https://fakestoreapi.com/products/${productId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Product updated:", data);
            document.getElementById('updateModal').classList.add('hidden');
        })
        .catch(error => console.error("Error updating product:", error));
});

fetchProducts();
