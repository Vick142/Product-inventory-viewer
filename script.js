// ========================================
// Inventory Management System
// ========================================

// Store products in memory
let products = [];
let productIdCounter = 1;

// DOM elements
const productForm = document.getElementById('productForm');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');

// ========================================
// Initialize App
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    productForm.addEventListener('submit', handleAddProduct);
    searchInput.addEventListener('input', handleSearch);
    updateTable();
});

// ========================================
// Add Product
// ========================================

function handleAddProduct(e) {
    e.preventDefault();
    
    // Get form values
    const productName = document.getElementById('productName').value.trim();
    const category = document.getElementById('category').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    
    // Basic validation
    if (!productName || !category) {
        alert('Please fill in all fields');
        return;
    }
    
    if (price < 0 || quantity < 0) {
        alert('Price and quantity must be positive numbers');
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
    
    // Reset form
    productForm.reset();
    
    // Update table
    updateTable();
}

// ========================================
// Delete Product
// ========================================

function deleteProduct(id) {
    // Remove product from array
    products = products.filter(product => product.id !== id);
    
    // Update table
    updateTable();
}

// ========================================
// Edit Product (Placeholder)
// ========================================

function editProduct(id) {
    const product = products.find(p => p.id === id);
    
    if (product) {
        // Fill form with product data
        document.getElementById('productName').value = product.name;
        document.getElementById('category').value = product.category;
        document.getElementById('price').value = product.price;
        document.getElementById('quantity').value = product.quantity;
        
        // Delete the old entry
        deleteProduct(id);
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ========================================
// Format Currency
// ========================================

function formatCurrency(amount) {
    return 'MWK ' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// ========================================
// Update Table
// ========================================

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
        
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.quantity}</td>
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

// ========================================
// Search Functionality
// ========================================

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        updateTable();
        return;
    }
    
    // Filter products
    const filtered = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               product.category.toLowerCase().includes(searchTerm);
    });
    
    updateTable(filtered);
}
