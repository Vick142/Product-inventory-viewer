# AquaVista Inventory Viewer

## Project Description
This is a web-based inventory management system that allows users to add, edit, delete, and view products. It runs entirely in the browser using HTML, CSS, and JavaScript. Data is saved to the browser's local storage, so it remains available even after refreshing the page.

## Features
- Add new products with name, category, price, and quantity.
- View all products in a table.
- Edit existing products using a pop-up window (modal).
- Delete products with a fade-out animation.
- Search for products by name or category.
- Sort products by name, category, price, or quantity.
- Dashboard showing total products, total value, and low stock items.
- Visual indicators (colors) for low, medium, and high stock levels.
- Notifications (toasts) when actions are performed.

---

## How the Code Works

### 1. HTML (index.html)
The HTML file provides the structure of the page. It is divided into several main sections:

- **Header**: Contains the title and the search bar.
- **Main Content**:
  - **Dashboard**: A section with three cards displaying statistics (Total Products, Total Value, Low Stock).
  - **Form Section**: A form where users input details for a new product.
  - **Table Section**: A table that lists all the inventory items. It includes a header row and a body where product rows are added dynamically.
- **Modal**: A hidden window structure that appears only when the user clicks "Edit".
- **Toast Container**: An empty container where notification messages are inserted by JavaScript.

### 2. CSS (style.css)
The CSS file handles the look and feel of the application.

- **Variables**: We use CSS variables (like `--color-dark`) at the top of the file. This allows us to define colors and spacing once and use them everywhere. If we want to change a color, we only change it in one place.
- **Layout**: We use **Flexbox** and **Grid** to arrange elements.
  - *Flexbox* is used for the header and rows to align items side-by-side.
  - *Grid* is used for the dashboard and form inputs to create responsive columns that adjust to the screen size.
- **Styling Classes**:
  - `.card`: Gives white backgrounds and shadows to sections.
  - `.btn-primary`: Styles the main buttons.
  - `.stock-low`, `.stock-medium`, `.stock-healthy`: These classes change the background color of the quantity badge based on how many items are in stock.
- **Animations**: We defined simple animations like `fadeIn` (for adding rows) and `fadeOut` (for deleting rows) to make the interface feel smooth.

### 3. JavaScript (script.js)
The JavaScript file contains the logic that makes the page interactive.

**Data Storage**
- We use an array called `products` to store the list of product objects.
- We use `localStorage` to save this array in the browser.
  - `saveToLocalStorage()`: Converts the array to a text string (JSON) and saves it.
  - `loadFromLocalStorage()`: Reads the text string, converts it back to an array, and loads it when the page starts.

**Adding a Product**
When the form is submitted:
1. The code prevents the page from reloading.
2. It gets the values from the input fields.
3. It creates a new object with those values and a unique ID.
4. It adds this object to the `products` array.
5. It saves the updated array to local storage.
6. It updates the table and dashboard to show the new data.

**Displaying the Table**
The `updateTable()` function is responsible for showing data:
1. It clears the current table content.
2. It loops through the `products` array.
3. For each product, it creates a new HTML row (`<tr>`) with the product details.
4. It checks the quantity and assigns the correct color class (red, yellow, or green).
5. It adds the row to the table body.

**Editing and Deleting**
- **Delete**: Finds the product by its ID, removes it from the array, saves the new list, and refreshes the table. It waits slightly for the fade-out animation to finish before removing it.
- **Edit**: Finds the product by ID and fills the modal inputs with the current data. When "Save" is clicked, it updates the specific item in the array and saves the changes.

**Search and Sort**
- **Search**: Filters the `products` array to find items that match the typed text, then runs `updateTable` with only those results.
- **Sort**: Reorders the `products` array based on the selected option (e.g., lowest price to highest price) and refreshes the table.


