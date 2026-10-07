// State Management
let productsData = [];

// Client-Side Navigation Routing
function navigateTo(viewName) {
  const homeView = document.getElementById('home-view');
  const catalogView = document.getElementById('catalog-view');
  const navButtons = document.querySelectorAll('.nav-btn');

  if (viewName === 'home') {
    homeView.classList.remove('hidden');
    catalogView.classList.add('hidden');
    navButtons[0].classList.add('active');
    navButtons[1].classList.remove('active');
  } else if (viewName === 'catalog') {
    catalogView.classList.remove('hidden');
    homeView.classList.add('hidden');
    navButtons[1].classList.add('active');
    navButtons[0].classList.remove('active');

    // Fetch products on first visit
    if (productsData.length === 0) {
      loadProducts();
    }
  }
}

// Fetch REST API Data
async function loadProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading catalog...</p>';

  try {
    const response = await fetch('https://fakestoreapi.com/products?limit=12');
    if (!response.ok) throw new Error('Network error');
    
    productsData = await response.json();
    renderProducts(productsData);
  } catch (error) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to load products. Please try again.</p>';
  }
}

// Render dynamic DOM product cards
function renderProducts(list) {
  const grid = document.getElementById('product-grid');

  if (list.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No matching products found.</p>';
    return;
  }

  grid.innerHTML = list.map(item => `
    <div class="product-card">
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <h3>${item.title.length > 35 ? item.title.substring(0, 35) + '...' : item.title}</h3>
      <span class="product-price">$${item.price.toFixed(2)}</span>
    </div>
  `).join('');
}

// Search Filter Logic
function filterProducts() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const filtered = productsData.filter(product =>
    product.title.toLowerCase().includes(query)
  );
  renderProducts(filtered);
}