// Product data
let products = [];
let productIdCounter = 1;
let currentEditId = null;
const STORAGE_KEY = 'aquavista_products';
const COUNTER_KEY = 'aquavista_counter';

// DOM elements
const productForm = document.getElementById('productForm');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const sortBySelect = document.getElementById('sortBy');
const editModal = document.getElementById('editModal');
const toastContainer = document.getElementById('toastContainer');

// Save and load from localStorage
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem(COUNTER_KEY, productIdCounter.toString());
}

function loadFromLocalStorage() {
    const savedProducts = localStorage.getItem(STORAGE_KEY);
    const savedCounter = localStorage.getItem(COUNTER_KEY);

    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }

    if (savedCounter) {
        productIdCounter = parseInt(savedCounter);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    productForm.addEventListener('submit', handleAddProduct);
    searchInput.addEventListener('input', handleSearch);
    sortBySelect.addEventListener('change', handleSort);
    updateTable();
    updateDashboard();
});

// Add new product
function handleAddProduct(e) {
    e.preventDefault();

    // Get form values
    const productName = document.getElementById('productName').value.trim();
    const category = document.getElementById('category').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    // Basic validation
    if (!productName || !category) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (price < 0 || quantity < 0) {
        showToast('Price and quantity must be positive numbers', 'error');
        return;
    }

    // Create product object
    const product = {
        id: productIdCounter++,
        name: productName,
        category: category,
        price: price,
        quantity: quantity
    };

    // Add to products array
    products.push(product);

    // Save to localStorage
    saveToLocalStorage();

    // Reset form
    productForm.reset();

    // Reset sort dropdown
    sortBySelect.value = 'none';

    // Show success toast
    showToast('Product added successfully!', 'success');

    // Update table and dashboard
    updateTable();
    updateDashboard();
}

// Delete product
function deleteProduct(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);

    if (row) {
        // Add fade-out animation
        row.classList.add('fade-out');

        // Wait for animation to complete before removing
        setTimeout(() => {
            // Remove product from array
            products = products.filter(product => product.id !== id);

            // Save to localStorage
            saveToLocalStorage();

            // Show success toast
            showToast('Product deleted successfully!', 'error');

            // Update table and dashboard
            updateTable();
            updateDashboard();
        }, 400);
    }
}

// Edit product - opens modal
function editProduct(id) {
    const product = products.find(p => p.id === id);

    if (product) {
        currentEditId = id;

        // Fill modal form with product data
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editCategory').value = product.category;
        document.getElementById('editPrice').value = product.price;
        document.getElementById('editQuantity').value = product.quantity;

        // Open modal
        editModal.classList.add('active');
    }
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('active');
    currentEditId = null;
}

// Save modal edit
function saveModalEdit() {
    if (currentEditId === null) return;

    // Get modal form values
    const productName = document.getElementById('editProductName').value.trim();
    const category = document.getElementById('editCategory').value.trim();
    const price = parseFloat(document.getElementById('editPrice').value);
    const quantity = parseInt(document.getElementById('editQuantity').value);

    // Basic validation
    if (!productName || !category) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (price < 0 || quantity < 0) {
        showToast('Price and quantity must be positive numbers', 'error');
        return;
    }

    // Find and update product
    const productIndex = products.findIndex(p => p.id === currentEditId);
    if (productIndex !== -1) {
        products[productIndex].name = productName;
        products[productIndex].category = category;
        products[productIndex].price = price;
        products[productIndex].quantity = quantity;

        // Save to localStorage
        saveToLocalStorage();

        // Show success toast
        showToast('Product updated successfully!', 'info');

        // Update table and dashboard
        updateTable();
        updateDashboard();

        // Close modal
        closeEditModal();
    }
}

// Close modal when clicking outside
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

// Format currency
function formatCurrency(amount) {
    return 'MWK ' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// Get stock badge class
function getStockBadgeClass(quantity) {
    if (quantity <= 3) return 'stock-low';
    if (quantity <= 10) return 'stock-medium';
    return 'stock-healthy';
}

// Update table display
function updateTable(filteredProducts = null) {
    const productsToDisplay = filteredProducts || products;

    // Clear table
    tableBody.innerHTML = '';

    // Show/hide empty state
    if (productsToDisplay.length === 0) {
        emptyState.classList.add('visible');
        return;
    } else {
        emptyState.classList.remove('visible');
    }

    // Add rows
    productsToDisplay.forEach(product => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', product.id);
        row.classList.add('fade-in');

        const stockBadgeClass = getStockBadgeClass(product.quantity);

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatCurrency(product.price)}</td>
            <td><span class="stock-badge ${stockBadgeClass}">${product.quantity}</span></td>
            <td>
                <div class="action-icons">
                    <button class="action-btn edit" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fi fi-rr-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fi fi-rr-trash"></i>
                    </button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Update dashboard
function updateDashboard() {
    // Total products
    const totalProducts = products.length;
    document.getElementById('totalProducts').textContent = totalProducts;

    // Total inventory value
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    document.getElementById('totalValue').textContent = formatCurrency(totalValue);

    // Low stock count (quantity <= 3)
    const lowStockCount = products.filter(product => product.quantity <= 3).length;
    document.getElementById('lowStockCount').textContent = lowStockCount;
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        handleSort();
        return;
    }

    // Filter products
    const filtered = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
    });

    updateTable(filtered);
}

// Sort functionality
function handleSort() {
    const sortBy = sortBySelect.value;
    let sortedProducts = [...products];

    switch (sortBy) {
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'category':
            sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
            break;
        case 'price':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'quantity':
            sortedProducts.sort((a, b) => a.quantity - b.quantity);
            break;
        default:
            // 'none' - use original order (by ID)
            sortedProducts.sort((a, b) => a.id - b.id);
            break;
    }

    updateTable(sortedProducts);
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon based on type
    let icon = 'fi-rr-info';
    if (type === 'success') icon = 'fi-rr-check';
    if (type === 'error') icon = 'fi-rr-cross';

    toast.innerHTML = `
        <i class="fi ${icon}"></i>
        <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
