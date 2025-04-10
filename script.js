// Глобальные переменные
let currentCategory = 'komplekty';
let currentPage = 1;
let allProducts = [];
let filteredProducts = null;
const itemsPerPage = 9;

// Глобальная функция для смены категории
function changeCategory(category) {
    currentCategory = category;
    
    // Обновляем активную кнопку
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('onclick').includes(`'${category}'`));
    });
    
    // Сбрасываем фильтры и загружаем товары
    filteredProducts = null;
    currentPage = 1;
    if (window.loadCatalogProducts) {
        loadCatalogProducts();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Инициализация приложения
    function init() {
        initMainSlider();
        loadAllProducts();
        initImageModal();
        initFilters();
        initEventListeners();
        initCart();
        initSearch();
        
        // Устанавливаем первую вкладку как активную
        document.querySelector(`.tab[onclick*="'${currentCategory}'"]`).classList.add('active');
    }

    // ====================== КОРЗИНА ======================
    function initCart() {
        updateCartCount();
        
        if (document.querySelector('.cart-page')) {
            loadCartItems();
            setupCartEventListeners();
        }
    }
    
    function addToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) {
            console.error('Товар не найден:', productId);
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name || 'Без названия',
                price: product.price || '0 ₽',
                image: product.image || 'img/no-image.png',
                size: product.size || 'N/A',
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        if (document.querySelector('.cart-page')) {
            loadCartItems();
        }
        
        showCartNotification('Товар добавлен в корзину');
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalCount;
        });
    }
    
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsContainer = document.getElementById('cart-items');
        const totalItemsEl = document.getElementById('total-items');
        const totalPriceEl = document.getElementById('total-price');
        
        if (!cartItemsContainer || !totalItemsEl || !totalPriceEl) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Ваша корзина пуста</p>';
            totalItemsEl.textContent = '0';
            totalPriceEl.textContent = '0 ₽';
            return;
        }
        
        cartItemsContainer.innerHTML = cart.map(createCartItem).join('');
        
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const totalPrice = cart.reduce((sum, item) => {
            const price = parseInt((item.price || '0').replace(/\D/g, '')) || 0;
            return sum + (price * (item.quantity || 1));
        }, 0);
        
        totalItemsEl.textContent = totalItems;
        totalPriceEl.textContent = `${totalPrice.toLocaleString()} ₽`;
    }
    
    function createCartItem(item) {
        if (!item) return '';
        
        const price = parseInt((item.price || '0').replace(/\D/g, '')) || 0;
        const total = price * (item.quantity || 1);
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item__image">
                    <img src="${item.image || 'img/no-image.png'}" alt="${item.name || 'Товар'}" 
                         onerror="this.src='img/no-image.png'">
                </div>
                <div class="cart-item__info">
                    <h3 class="cart-item__title">${item.name || 'Без названия'}</h3>
                    <p class="cart-item__size">${item.size || 'N/A'}</p>
                    <div class="cart-item__price">${item.price || '0 ₽'}</div>
                </div>
                <div class="cart-item__quantity">
                    <button class="quantity-btn minus">−</button>
                    <span class="quantity">${item.quantity || 1}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="cart-item__total">${total.toLocaleString()} ₽</div>
                <button class="cart-item__remove">×</button>
            </div>
        `;
    }
    
    function setupCartEventListeners() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;
        
        cartItemsContainer.addEventListener('click', function(e) {
            const target = e.target;
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return;
            
            const productId = cartItem.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex === -1) return;
            
            if (target.classList.contains('plus')) {
                cart[itemIndex].quantity += 1;
            } else if (target.classList.contains('minus')) {
                cart[itemIndex].quantity > 1 ? 
                    cart[itemIndex].quantity -= 1 : 
                    cart.splice(itemIndex, 1);
            } else if (target.classList.contains('cart-item__remove')) {
                cart.splice(itemIndex, 1);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            loadCartItems();
        });
        
        document.getElementById('checkout-btn')?.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Ваша корзина пуста');
                return;
            }
            alert('Заказ оформлен! Спасибо за покупку!');
            localStorage.removeItem('cart');
            updateCartCount();
            loadCartItems();
        });
    }
    
    function showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ====================== ТОВАРЫ ======================
    async function loadAllProducts() {
        try {
            const response = await fetch("products.json");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Ожидался JSON, получено: ${text.slice(0, 50)}...`);
            }
            
            allProducts = await response.json();
            
            // Валидация и нормализация данных
            allProducts = allProducts.map(product => ({
                id: product.id || generateId(),
                name: product.name || 'Без названия',
                price: product.price || '0 ₽',
                image: product.image || 'img/no-image.png',
                size: product.size || 'N/A',
                color: product.color || getRandomColor(),
                inStock: product.inStock !== undefined ? product.inStock : true,
                addedDate: product.addedDate || new Date().toISOString(),
                category: product.category || 'komplekty',
                ...product
            }));
            
            loadPopularProducts(['1', '9', '4', '6', '3', '2']);
            
            if (document.getElementById('product-list')) {
                loadCatalogProducts();
            }
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error);
            showErrorToUser();
        }
    }

    function loadPopularProducts(popularIds) {
        const slider = document.getElementById('popular-products-slider');
        if (!slider) return;
        
        const popularProducts = allProducts.filter(p => popularIds.includes(p.id));
        slider.innerHTML = popularProducts.length ? 
            popularProducts.map(createPopularProductCard).join('') : 
            '<p>Нет популярных товаров</p>';
        
        initPopularSlider();
        initCartButtons();
    }

    function createPopularProductCard(product) {
        return `
            <div class="product-cardd" data-id="${product.id}">
                <img src="${product.image || 'img/no-image.png'}" alt="${product.name || 'Товар'}" 
                     class="product-cardd__image" loading="lazy" 
                     onerror="this.src='img/no-image.png'">
                <h3 class="product-cardd__title">${product.name || 'Без названия'}</h3>
                <p class="product-cardd__size">${product.size || 'N/A'}</p>
                <div class="product-cardd__footer">
                    <span class="product-cardd__price">${product.price || '0 ₽'}</span>
                    <button class="product-cardd__cart" aria-label="Добавить в корзину">
                        <img src="img/vkorzinu.png" alt="" role="presentation">
                    </button>
                </div>
            </div>
        `;
    }

    function loadCatalogProducts() {
        // Проверяем есть ли сохраненный поисковый запрос
        const searchQuery = localStorage.getItem('searchQuery');
        
        // Фильтруем по текущей категории
        let productsToFilter = allProducts.filter(product => product.category === currentCategory);
        
        if (searchQuery && !filteredProducts) {
            productsToFilter = productsToFilter.filter(product => 
                (product.name || '').toLowerCase().includes(searchQuery) ||
                (product.description || '').toLowerCase().includes(searchQuery)
            );
            localStorage.removeItem('searchQuery');
        }
        
        // Применяем дополнительные фильтры если они есть
        if (filteredProducts) {
            productsToFilter = productsToFilter.filter(product => 
                filteredProducts.some(p => p.id === product.id)
            );
        }
        
        const container = document.getElementById('product-list');
        if (!container) return;
        
        const totalPages = Math.ceil(productsToFilter.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = productsToFilter.slice(startIndex, startIndex + itemsPerPage);
        
        container.innerHTML = paginatedProducts.length ? 
            paginatedProducts.map(createProductCard).join('') : 
            '<p class="no-products">Товары не найдены</p>';
        
        updatePagination(totalPages, productsToFilter.length);
        initCartButtons();
    }

    function createProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image || 'img/no-image.png'}" 
                     alt="${product.name || 'Товар'}" 
                     class="product-image" loading="lazy" 
                     onerror="this.src='img/no-image.png'">
                <div class="product-info">
                    <h3>
                        <a href="pages/product${product.id}.html?id=${product.id}" 
                           class="product-link">${product.name || 'Без названия'}</a>
                    </h3>
                    <p class="product-size">${product.size || 'N/A'}</p>
                    <div class="product-footer">
                        <strong class="product-price">${product.price || '0 ₽'}</strong>
                        <button class="add-to-cart" aria-label="Добавить в корзину">
                            <img src="img/vkorzinu.png" alt="" role="presentation">
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function initSearch() {
        const searchBox = document.querySelector('.search-box');
        if (!searchBox) return;

        const searchInput = searchBox.querySelector('input');
        const searchButton = searchBox.querySelector('button');

        function performSearch() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (!searchTerm) return;

            localStorage.setItem('searchQuery', searchTerm);
            
            if (document.getElementById('product-list')) {
                filteredProducts = allProducts.filter(product => 
                    (product.name || '').toLowerCase().includes(searchTerm) ||
                    (product.description || '').toLowerCase().includes(searchTerm)
                );
                currentPage = 1;
                loadCatalogProducts();
            } else {
                window.location.href = 'tovars.php';
            }
        }

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }

    // ====================== ПАГИНАЦИЯ ======================
    function updatePagination(totalPages, totalItems) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        const prevBtn = pagination.querySelector('.pagination-prev');
        const nextBtn = pagination.querySelector('.pagination-next');
        const pagesContainer = pagination.querySelector('.pagination-pages');
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        pagesContainer.innerHTML = '';
        
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
        
        if (startPage > 1) {
            addPageButton(1, pagesContainer);
            if (startPage > 2) pagesContainer.appendChild(createEllipsis());
        }
        
        for (let i = startPage; i <= endPage; i++) addPageButton(i, pagesContainer);
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pagesContainer.appendChild(createEllipsis());
            addPageButton(totalPages, pagesContainer);
        }
    }

    function addPageButton(page, container) {
        const btn = document.createElement('button');
        btn.textContent = page;
        btn.className = page === currentPage ? 'active' : '';
        btn.addEventListener('click', () => {
            currentPage = page;
            loadCatalogProducts();
        });
        container.appendChild(btn);
    }

    function createEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        return ellipsis;
    }

    // ====================== ФИЛЬТРЫ ======================
    function initFilters() {
        const filterForm = document.getElementById('filter-form');
        if (!filterForm) return;

        initColorFilters();

        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });

        filterForm.querySelector('.reset-button').addEventListener('click', function() {
            setTimeout(() => {
                resetFilters();
                applyFilters();
            }, 0);
        });

        const priceInputs = filterForm.querySelectorAll('.price-inputs input');
        let priceTimeout;
        priceInputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(priceTimeout);
                priceTimeout = setTimeout(applyFilters, 500);
            });
        });

        filterForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
    }

    function initColorFilters() {
        document.querySelectorAll('.color-circle').forEach(circle => {
            circle.addEventListener('click', function() {
                this.classList.toggle('selected');
                applyFilters();
            });
        });
    }

    function applyFilters() {
        const searchQuery = localStorage.getItem('searchQuery') || '';
    
        // Начинаем с товаров текущей категории
        filteredProducts = allProducts.filter(product => product.category === currentCategory);
        
        // Применяем поиск, если есть запрос
        if (searchQuery) {
            filteredProducts = filteredProducts.filter(product => 
                (product.name || '').toLowerCase().includes(searchQuery) ||
                (product.description || '').toLowerCase().includes(searchQuery)
            );
        }

        // Фильтрация по цене
        const minPrice = parseInt(document.querySelector('.price-inputs input:nth-child(1)').value) || 0;
        const maxPrice = parseInt(document.querySelector('.price-inputs input:nth-child(2)').value) || Infinity;
        
        filteredProducts = filteredProducts.filter(product => {
            const price = parseInt((product.price || '0').replace(/\D/g, '')) || 0;
            return price >= minPrice && price <= maxPrice;
        });

        // Фильтрация по размеру
        const sizeCheckboxes = document.querySelectorAll('.filter-section.size-filter input[type="checkbox"]:checked');
        if (sizeCheckboxes.length > 0) {
            const selectedSizes = Array.from(sizeCheckboxes).map(cb => {
                return cb.value.trim();
            }).filter(Boolean);
            
            filteredProducts = filteredProducts.filter(product => {
                if (!product.size) return false;
                const productSize = product.size.toString().trim();
                return selectedSizes.some(size => 
                    productSize === size || productSize.includes(size)
                );
            });
        }

        // Фильтрация по цвету
        const selectedColors = Array.from(document.querySelectorAll('.color-circle.selected'))
            .map(circle => normalizeColor(circle.style.backgroundColor))
            .filter(Boolean);
        
        if (selectedColors.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                selectedColors.includes(normalizeColor(product.color))
            );
        }

        // Фильтрация по наличию
        if (document.querySelector('.filter-section:nth-child(4) input[type="checkbox"]:checked')) {
            filteredProducts = filteredProducts.filter(product => product.inStock !== false);
        }

        // Сортировка
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            const sortValue = sortSelect.value;
            if (sortValue === 'cheap') {
                filteredProducts.sort((a, b) => {
                    const priceA = parseInt((a.price || '0').replace(/\D/g, '')) || 0;
                    const priceB = parseInt((b.price || '0').replace(/\D/g, '')) || 0;
                    return priceA - priceB;
                });
            } else if (sortValue === 'expensive') {
                filteredProducts.sort((a, b) => {
                    const priceA = parseInt((a.price || '0').replace(/\D/g, '')) || 0;
                    const priceB = parseInt((b.price || '0').replace(/\D/g, '')) || 0;
                    return priceB - priceA;
                });
            } else if (sortValue === 'new') {
                filteredProducts.sort((a, b) => 
                    new Date(b.addedDate || 0) - new Date(a.addedDate || 0)
                );
            }
        }

        currentPage = 1;
        loadCatalogProducts();
    }

    function resetFilters() {
        document.querySelectorAll('.price-inputs input').forEach(input => input.value = '');
        document.querySelectorAll('#filter-form input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('.color-circle').forEach(circle => circle.classList.remove('selected'));
        document.getElementById('sort-select').value = 'popular';
        filteredProducts = null;
        loadCatalogProducts();
    }

    // ====================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======================
    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    function getRandomColor() {
        const colors = ['#6fc7ff', '#9acd32', '#ffffff', '#f08080', '#ff4500', '#e5c29f', '#8b4513', '#000000'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function normalizeColor(color) {
        if (!color) return '';
        if (color.startsWith('rgb')) {
            const rgb = color.match(/\d+/g);
            if (rgb?.length >= 3) {
                return `#${((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1)}`.toLowerCase();
            }
        }
        return color.toLowerCase();
    }

    function showErrorToUser() {
        const slider = document.getElementById('popular-products-slider');
        if (slider) slider.innerHTML = '<p class="error">Не удалось загрузить товары</p>';
        
        const catalog = document.getElementById('product-list');
        if (catalog) catalog.innerHTML = `
            <div class="load-error">
                <p>Произошла ошибка при загрузке товаров</p>
                <button onclick="location.reload()">Попробовать снова</button>
            </div>
        `;
    }

    // ====================== СЛАЙДЕРЫ ======================
    function initMainSlider() {
        const mainSlider = document.querySelector('.main-slider');
        if (!mainSlider) return;
        
        const slides = document.querySelectorAll('.main-slider__slide');
        const dots = document.querySelectorAll('.main-slider__dot');
        let currentSlide = 0;
        let sliderInterval;
        
        function showSlide(index) {
            slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
            currentSlide = index;
        }
        
        function nextSlide() {
            showSlide((currentSlide + 1) % slides.length);
        }
        
        function startSlider() {
            stopSlider();
            sliderInterval = setInterval(nextSlide, 5000);
        }
        
        function stopSlider() {
            clearInterval(sliderInterval);
        }
        
        showSlide(0);
        startSlider();
        
        mainSlider.addEventListener('mouseenter', stopSlider);
        mainSlider.addEventListener('mouseleave', startSlider);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopSlider();
                startSlider();
            });
        });
    }

    function initPopularSlider() {
        const slider = document.querySelector('.popular-products__slider');
        const cards = document.querySelectorAll('.product-cardd');
        const prevBtn = document.querySelector('.popular-products__arrow--left');
        const nextBtn = document.querySelector('.popular-products__arrow--right');
        
        if (!slider || !cards.length || !prevBtn || !nextBtn) return;
        
        let cardWidth = cards[0].offsetWidth + 20;
        const visibleCards = 3;
        let currentPos = 0;
        
        function updateSlider() {
            slider.style.transform = `translateX(-${currentPos * cardWidth}px)`;
            prevBtn.disabled = currentPos === 0;
            nextBtn.disabled = currentPos >= cards.length - visibleCards;
        }
        
        function slideNext() {
            currentPos = Math.min(cards.length - visibleCards, currentPos + 1);
            updateSlider();
        }
        
        function slidePrev() {
            currentPos = Math.max(0, currentPos - 1);
            updateSlider();
        }
        
        prevBtn.addEventListener('click', slidePrev);
        nextBtn.addEventListener('click', slideNext);
        
        new ResizeObserver(() => {
            const newWidth = cards[0].offsetWidth + 20;
            if (newWidth !== cardWidth) {
                cardWidth = newWidth;
                updateSlider();
            }
        }).observe(slider);
        
        updateSlider();
    }

    // ====================== МОДАЛЬНОЕ ОКНО ======================
    function initImageModal() {
        const modal = document.getElementById('image-modal');
        if (!modal) return;
        
        const modalImg = document.getElementById('modal-image');
        const closeBtn = modal.querySelector('.close');
        
        document.querySelectorAll('[data-modal-image]').forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = 'block';
                modalImg.src = img.src;
                document.body.style.overflow = 'hidden';
            });
        });
        
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        
        closeBtn?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => e.target === modal && closeModal());
        document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
    }

    // ====================== ОБРАБОТЧИКИ СОБЫТИЙ ======================
    function initEventListeners() {
        document.querySelector('.pagination-prev')?.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadCatalogProducts();
            }
        });
        
        document.querySelector('.pagination-next')?.addEventListener('click', () => {
            const totalPages = Math.ceil((filteredProducts || allProducts).length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                loadCatalogProducts();
            }
        });
        
        initCartButtons();
    }

    function initCartButtons() {
        document.removeEventListener('click', handleCartButtonClick);
        document.addEventListener('click', handleCartButtonClick);
    }
    
    function handleCartButtonClick(e) {
        const cartBtn = e.target.closest('.product-cardd__cart, .add-to-cart');
        if (cartBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = cartBtn.closest('[data-id]');
            if (!productCard) return;
            
            const productId = productCard.dataset.id;
            addToCart(productId);
        }
    }

    // Добавляем стили для уведомлений
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .cart-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        .error, .load-error {
            color: #d32f2f;
            text-align: center;
            padding: 20px;
        }
        .load-error button {
            margin-top: 10px;
            padding: 8px 16px;
            background: #d32f2f;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
        }
        .tab {
            padding: 10px 20px;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
        }
        .tab:hover {
            color: #fff;
        }
        .tab.active {
            color: #9BA2E4;
            border-bottom-color: #9BA2E4;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Запуск приложения
    init();
});