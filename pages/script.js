document.addEventListener("DOMContentLoaded", function () {
    const reviewForm = document.getElementById("review-form");
    const reviewsList = document.getElementById("reviews-list");
    const ratingElement = document.getElementById("product-rating");

    // Загрузка отзывов из localStorage
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    // Отображение отзывов
    function displayReviews() {
        reviewsList.innerHTML = "";
        reviews.forEach(review => {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review");
            reviewElement.innerHTML = `
                <p><strong>${review.name}, ${review.date}</strong></p>
                <p>Оценка: ${review.rating}/5</p>
                <p>${review.text}</p>
            `;
            reviewsList.appendChild(reviewElement);
        });

        // Обновление рейтинга
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
            const averageRating = (totalRating / reviews.length).toFixed(1);
            ratingElement.textContent = averageRating;
        }
    }

    // Добавление нового отзыва
    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("review-name").value;
        const text = document.getElementById("review-text").value;
        const rating = document.getElementById("review-rating").value;

        const newReview = {
            name: name,
            text: text,
            rating: rating,
            date: new Date().toLocaleDateString()
        };

        reviews.push(newReview);
        localStorage.setItem("reviews", JSON.stringify(reviews));

        displayReviews();
        reviewForm.reset();
    });

    // Переключение между вкладками
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            const tab = this.getAttribute("data-tab");

            tabButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            tabContents.forEach(content => content.style.display = "none");
            document.getElementById(tab).style.display = "block";
        });
    });

    // Инициализация
    displayReviews();
});

function loadProducts(products) {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = "";

    if (products.length === 0) {
        productContainer.innerHTML = "<p>Товары не найдены.</p>";
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3><a href="pages/product${product.id}.html?id=${product.id}">${product.name}</a></h3>
                <p>${product.size}</p>
                <strong>${product.price}</strong>
                <button class="add-to-cart"><img src="img/vkorzinu.png" alt="Добавить в корзину"></button>
            </div>
        `;

        productContainer.appendChild(productCard);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    // Загрузка данных из JSON
    fetch("../products.json")
        .then(response => response.json())
        .then(products => {
            // Находим товар по ID
            const product = products.find(p => p.id === productId);

            if (product) {
                // Заполняем данные на странице
                document.getElementById("product-name").textContent = product.name;
                document.getElementById("product-article").textContent = `Артикул: ${product.article}`;
                document.getElementById("product-rating").textContent = product.rating;
                document.getElementById("product-price").textContent = `Цена: ${product.price}`;
                document.getElementById("product-description").textContent = product.description;

                // Заполняем комплектацию
                const specsList = document.getElementById("product-specs");
                specsList.innerHTML = product.specs.map(spec => `<li>${spec}</li>`).join("");

                // Заполняем картинки
                const mainImage = document.getElementById("main-image");
                const smallImages = document.querySelectorAll(".small-image");

                mainImage.src = product.images[0];
                smallImages.forEach((img, index) => {
                    img.src = product.images[index + 1];
                });
            } else {
                // Если товар не найден
                document.getElementById("product-name").textContent = "Товар не найден";
            }
        })
        .catch(error => {
            console.error("Ошибка загрузки данных:", error);
            document.getElementById("product-name").textContent = "Ошибка загрузки данных";
        });
});

document.addEventListener("DOMContentLoaded", function () {
    // Получаем элементы модального окна
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-image");
    const closeBtn = document.querySelector(".close");

    // Получаем только изображения из конкретных классов
    const mainImage = document.querySelector(".main-image img");
    const smallImages = document.querySelectorAll(".small-images img");

    // Добавляем обработчик клика на главное изображение
    if (mainImage) {
        mainImage.addEventListener("click", function () {
            modal.style.display = "block"; // Показываем модальное окно
            modalImg.src = this.src; // Устанавливаем изображение в модальное окно
        });
    }

    // Добавляем обработчик клика на маленькие изображения
    smallImages.forEach(img => {
        img.addEventListener("click", function () {
            modal.style.display = "block"; // Показываем модальное окно
            modalImg.src = this.src; // Устанавливаем изображение в модальное окно
        });
    });

    // Закрытие модального окна при клике на крестик
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Закрытие модального окна при клике вне изображения
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});