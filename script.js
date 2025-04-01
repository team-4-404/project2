document.addEventListener("DOMContentLoaded", function() {
    // Объявляем глобальные переменные в начале
    const itemsPerPage = 9;
    let currentPage = 1;
    let allProducts = [];
    let filteredProducts = null;

    // Инициализация приложения
    function init() {
        initMainSlider();
        loadAllProducts();
        initImageModal();
        initFilters();
        initEventListeners();
        initCart(); // Инициализация корзины
    }

    // ====================== Функционал корзины ======================
    function initCart() {
        // Инициализируем корзину при загрузке страницы
        updateCartCount();
        
        // Если это страница корзины - загружаем товары
        if (document.querySelector('.cart-page')) {
            loadCartItems();
            setupCartEventListeners();
        }
    }
    
    // Исправленная функция добавления в корзину
    function addToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Ищем индекс товара вместо самого товара (более надежно)
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        if (existingItemIndex !== -1) {
            // Увеличиваем количество только на 1
            cart[existingItemIndex].quantity += 1;
        } else {
            // Добавляем новый товар с количеством 1
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.size,
                quantity: 1  // Явно указываем 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        if (document.querySelector('.cart-page')) {
            loadCartItems();
        }
        
        showCartNotification('Товар добавлен в корзину');
    }

    // Исправленная инициализация кнопок корзины
    function initCartButtons() {
        // Удаляем старые обработчики перед добавлением новых
        document.querySelectorAll('.product-cardd__cart, .add-to-cart').forEach(btn => {
            btn.removeEventListener('click', handleCartClick);
        });
        
        // Добавляем новые обработчики
        document.addEventListener('click', handleCartClick, { once: true });
    }

    function handleCartClick(e) {
        const cartBtn = e.target.closest('.product-cardd__cart, .add-to-cart');
        if (cartBtn) {
            e.preventDefault();
            e.stopPropagation(); // Предотвращаем всплытие
            
            const productId = cartBtn.closest('[data-id]').dataset.id;
            addToCart(productId);
        }
    }
    
    // Обновление счетчика товаров в шапке
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalCount;
        });
    }
    
    // Загрузка товаров в корзину на странице корзины (исправлено)
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
        
        // Отображаем товары
        cartItemsContainer.innerHTML = cart.map(createCartItem).join('');
        
        // Подсчитываем общее количество и сумму
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => {
            const price = parseInt(item.price.replace(/\D/g, '')) || 0;
            return sum + (price * item.quantity);
        }, 0);
        
        totalItemsEl.textContent = totalItems;
        totalPriceEl.textContent = `${totalPrice.toLocaleString()} ₽`;
    }
    
    // Создание HTML для товара в корзине
    function createCartItem(item) {
        const price = parseInt(item.price.replace(/\D/g, '')) || 0;
        const total = price * item.quantity;
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item__image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='img/no-image.png'">
                </div>
                <div class="cart-item__info">
                    <h3 class="cart-item__title">${item.name}</h3>
                    <p class="cart-item__size">${item.size}</p>
                    <div class="cart-item__price">${item.price}</div>
                </div>
                <div class="cart-item__quantity">
                    <button class="quantity-btn minus">−</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="cart-item__total">${total.toLocaleString()} ₽</div>
                <button class="cart-item__remove">×</button>
            </div>
        `;
    }
    
    // Настройка обработчиков событий для корзины (исправлено)
    function setupCartEventListeners() {
        const cartItemsContainer = document.getElementById('cart-items');
        const checkoutBtn = document.getElementById('checkout-btn');
        
        if (!cartItemsContainer) return;
        
        // Обработчики изменения количества и удаления
        cartItemsContainer.addEventListener('click', function(e) {
            const target = e.target;
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return;
            
            const productId = cartItem.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex === -1) return;
            
            if (target.classList.contains('plus')) {
                // Увеличиваем количество на 1
                cart[itemIndex].quantity += 1;
            } else if (target.classList.contains('minus')) {
                // Уменьшаем количество (но не меньше 1)
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity -= 1;
                } else {
                    // Если количество стало 0 - удаляем товар
                    cart.splice(itemIndex, 1);
                }
            } else if (target.classList.contains('cart-item__remove')) {
                // Удаляем товар
                cart.splice(itemIndex, 1);
            }
            
            // Сохраняем изменения
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            loadCartItems();
        });
        
        // Обработчик кнопки оформления заказа
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length === 0) {
                    alert('Ваша корзина пуста');
                    return;
                }
                
                // Здесь можно добавить логику оформления заказа
                alert('Заказ оформлен! Спасибо за покупку!');
                localStorage.removeItem('cart');
                updateCartCount();
                loadCartItems();
            });
        }
    }
    
    // Показ уведомления о добавлении в корзину
    function showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Добавим стили для уведомления динамически
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
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .cart-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // ====================== Главный слайдер ======================
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

    // ====================== Слайдер популярных товаров ======================
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

    // ====================== Загрузка товаров ======================
    async function loadAllProducts() {
        try {
            const response = await fetch("products.json");
            if (!response.ok) throw new Error("Ошибка загрузки данных");
            
            allProducts = await response.json();
            
            // Добавляем цвет товарам, если его нет (для примера)
            allProducts.forEach(product => {
                if (!product.color) {
                    // Назначаем случайный цвет из доступных
                    const colors = ['#6fc7ff', '#9acd32', '#ffffff', '#f08080', '#ff4500', '#e5c29f', '#8b4513', '#000000'];
                    product.color = colors[Math.floor(Math.random() * colors.length)];
                }
                // Добавляем поле наличия, если его нет
                if (product.inStock === undefined) {
                    product.inStock = Math.random() > 0.3; // 70% chance in stock
                }
            });
            
            loadPopularProducts(['1', '9', '4', '6', '3', '2']);
            
            if (document.getElementById('product-list')) {
                loadCatalogProducts();
            }
        } catch (error) {
            console.error("Ошибка:", error);
            const slider = document.getElementById('popular-products-slider');
            if (slider) slider.innerHTML = '<p class="error">Не удалось загрузить товары</p>';
        }
    }

    function loadPopularProducts(popularIds) {
        const slider = document.getElementById('popular-products-slider');
        if (!slider) return;
        
        const popularProducts = allProducts.filter(p => popularIds.includes(p.id));
        slider.innerHTML = popularProducts.length ? popularProducts.map(createPopularProductCard).join('') : '<p>Нет популярных товаров</p>';
        
        initPopularSlider();
        initCartButtons();
    }

    function createPopularProductCard(product) {
        return `
            <div class="product-cardd" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-cardd__image" loading="lazy" onerror="this.src='img/no-image.png'">
                <h3 class="product-cardd__title">${product.name}</h3>
                <p class="product-cardd__size">Размер: ${product.size}</p>
                <div class="product-cardd__footer">
                    <span class="product-cardd__price">${product.price}</span>
                    <button class="product-cardd__cart" aria-label="Добавить в корзину">
                        <img src="img/vkorzinu.png" alt="" role="presentation">
                    </button>
                </div>
            </div>
        `;
    }

    function loadCatalogProducts() {
        const container = document.getElementById('product-list');
        if (!container) return;
        
        const productsToShow = filteredProducts || allProducts;
        const totalPages = Math.ceil(productsToShow.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = productsToShow.slice(startIndex, startIndex + itemsPerPage);
        
        container.innerHTML = paginatedProducts.length 
            ? paginatedProducts.map(createProductCard).join('')
            : '<p class="no-products">Товары не найдены</p>';
        
        updatePagination(totalPages, productsToShow.length);
        initCartButtons();
    }

    function createProductCard(product) {
        return `
            <div class="product-card" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onerror="this.src='img/no-image.png'">
                <div class="product-info">
                    <h3><a href="pages/product${product.id}.html?id=${product.id}" class="product-link">${product.name}</a></h3>
                    <p class="product-size">${product.size}</p>
                    <div class="product-footer">
                        <strong class="product-price">${product.price}</strong>
                        <button class="add-to-cart" aria-label="Добавить в корзину">
                            <img src="img/vkorzinu.png" alt="" role="presentation">
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ====================== Пагинация ======================
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
        
        // Диапазон отображаемых страниц
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
        
        // Первая страница + многоточие
        if (startPage > 1) {
            addPageButton(1, pagesContainer);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                pagesContainer.appendChild(ellipsis);
            }
        }
        
        // Основные страницы
        for (let i = startPage; i <= endPage; i++) {
            addPageButton(i, pagesContainer);
        }
        
        // Последняя страница + многоточие
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                pagesContainer.appendChild(ellipsis);
            }
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

    // ====================== Фильтры ======================
    function initFilters() {
        const filterForm = document.getElementById('filter-form');
        if (!filterForm) return;

        // Инициализация цветовых фильтров
        initColorFilters();

        // Обработчик формы
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });

        // Обработчик сброса
        filterForm.querySelector('.reset-button').addEventListener('click', function() {
            setTimeout(() => {
                resetFilters();
                applyFilters();
            }, 0);
        });

        // Дебаунс для полей цены
        const priceInputs = filterForm.querySelectorAll('.price-inputs input');
        let priceTimeout;
        
        priceInputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(priceTimeout);
                priceTimeout = setTimeout(() => {
                    applyFilters();
                }, 500);
            });
        });

        // Обработчики для чекбоксов
        const checkboxes = filterForm.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                applyFilters();
            });
        });
    }

    function initColorFilters() {
        const colorCircles = document.querySelectorAll('.color-circle');
        colorCircles.forEach(circle => {
            circle.addEventListener('click', function() {
                this.classList.toggle('selected');
                applyFilters();
            });
        });
    }

    function applyFilters() {
        filteredProducts = [...allProducts];
        
        // 1. Фильтрация по цене
        const minPrice = parseInt(document.querySelector('.price-inputs input:nth-child(1)').value) || 0;
        const maxPrice = parseInt(document.querySelector('.price-inputs input:nth-child(2)').value) || Infinity;
        
        filteredProducts = filteredProducts.filter(product => {
            const price = parseInt(product.price.replace(/\D/g, '')) || 0;
            return price >= minPrice && price <= maxPrice;
        });

        
        // Фильтрация по размеру
        const sizeCheckboxes = document.querySelectorAll('.filter-section:nth-child(2) input[type="checkbox"]:checked');
        if (sizeCheckboxes.length > 0) {
            const sizeMapping = {
                "1 СП": ["1 СП", "120x150"],
                "1,5 СП": ["1,5 СП"],
                "2 СП": ["2 СП"],
                "ЕВРО": ["ЕВРО"]
            };
            
            const selectedSizes = Array.from(sizeCheckboxes).map(cb => {
                const labelText = cb.nextElementSibling?.textContent?.trim();
                return sizeMapping[labelText] || [labelText];
            }).flat();
            
            filteredProducts = filteredProducts.filter(product => 
                selectedSizes.some(size => product.size.includes(size))
            );
        }

        // 3. Фильтрация по цвету
        const selectedColors = Array.from(document.querySelectorAll('.color-circle.selected')).map(circle => {
            return normalizeColor(circle.style.backgroundColor);
        });
        
        if (selectedColors.length > 0) {
            filteredProducts = filteredProducts.filter(product => {
                if (!product.color) return false;
                return selectedColors.includes(normalizeColor(product.color));
            });
        }

        // 4. Фильтрация по наличию
        const inStockCheckbox = document.querySelector('.filter-section:nth-child(4) input[type="checkbox"]');
        if (inStockCheckbox?.checked) {
            filteredProducts = filteredProducts.filter(product => product.inStock !== false);
        }

        // Сортировка
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            const sortValue = sortSelect.value;
            if (sortValue === 'cheap') {
                filteredProducts.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
                    const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
                    return priceA - priceB;
                });
            } else if (sortValue === 'expensive') {
                filteredProducts.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
                    const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
                    return priceB - priceA;
                });
            } else if (sortValue === 'new') {
                // Сортировка по новизне (если есть дата добавления)
                filteredProducts.sort((a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0));
            }
        }

        // Сбрасываем на первую страницу при новом фильтре
        currentPage = 1;
        
        // Обновляем отображение товаров
        loadCatalogProducts();
    }

    function resetFilters() {
        // Сбрасываем значения полей
        document.querySelectorAll('.price-inputs input').forEach(input => {
            input.value = '';
        });

        // Снимаем все чекбоксы
        document.querySelectorAll('#filter-form input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Снимаем выделение с цветов
        document.querySelectorAll('.color-circle').forEach(circle => {
            circle.classList.remove('selected');
        });

        // Сбрасываем сортировку
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'popular';

        // Сбрасываем filteredProducts
        filteredProducts = null;
    }

    // Вспомогательная функция для нормализации цвета
    function normalizeColor(color) {
        if (!color) return '';
        
        // Конвертируем rgb в hex и приводим к нижнему регистру
        if (color.startsWith('rgb')) {
            const rgb = color.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                return `#${((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1)}`.toLowerCase();
            }
        }
        return color.toLowerCase();
    }

    // ====================== Модальное окно ======================
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

    // ====================== Обработчики событий ======================
    function initEventListeners() {
        // Обработчики пагинации
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
        
        // Инициализация кнопок корзины
        initCartButtons();
    }

    function initCartButtons() {
        document.addEventListener('click', function(e) {
            const cartBtn = e.target.closest('.product-cardd__cart, .add-to-cart');
            if (cartBtn) {
                e.preventDefault();
                const productId = cartBtn.closest('[data-id]').dataset.id;
                addToCart(productId);
            }
        });
    }

    // Запуск приложения
    init();
});

// Функция для загрузки товаров
async function loadProducts(category = null, sort = 'popular', filters = {}) {
    try {
        const queryParams = new URLSearchParams({
            ajax: true,
            category: category || '',
            sort: sort,
            ...filters
        });

        const response = await fetch(`products.php?${queryParams}`);
        const products = await response.json();
        
        const productList = document.getElementById('product-list');
        if (!productList) return;

        productList.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price} ₽</p>
                <p class="size">Размер: ${product.size}</p>
                ${product.in_stock 
                    ? `<button class="add-to-cart" data-id="${product.id}">В корзину</button>`
                    : `<button class="out-of-stock" disabled>Нет в наличии</button>`
                }
            </div>
        `).join('');

        // Обработчики для кнопок "В корзину"
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => addToCart(button.dataset.id));
        });

    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
    }
}

// Функция для добавления в корзину
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '{}');
    cart[productId] = (cart[productId] || 0) + 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Функция обновления счетчика корзины
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '{}');
    const count = Object.values(cart).reduce((sum, count) => sum + count, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Обработчик изменения категории
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                loadProducts(tab.getAttribute('onclick').match(/'(.+?)'/)[1]);
            });
        });
    }

    // Обработчик сортировки
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const activeTab = document.querySelector('.tab.active');
            const category = activeTab ? activeTab.getAttribute('onclick').match(/'(.+?)'/)[1] : null;
            loadProducts(category, sortSelect.value);
        });
    }

    // Обработчик фильтров
    const filterForm = document.getElementById('filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(filterForm);
            const filters = {
                price_min: formData.get('price_min'),
                price_max: formData.get('price_max'),
                size: formData.get('size'),
                color: formData.get('color'),
                in_stock: formData.get('in_stock') === 'on'
            };
            const activeTab = document.querySelector('.tab.active');
            const category = activeTab ? activeTab.getAttribute('onclick').match(/'(.+?)'/)[1] : null;
            loadProducts(category, sortSelect.value, filters);
        });
    }

    // Загрузка товаров при первом открытии страницы
    if (document.getElementById('product-list')) {
        loadProducts();
    }
});