<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js" defer></script>
</head>
<body>

<?php include 'includes/header.php'; ?>

    <main class="main-container">
        <!-- Секция слайдера -->
        <section class="main-slider">
            <div class="main-slider__slides">
                <div class="main-slider__slide active">
                    <img src="img/main-slider-1.jpg" alt="Slide 1">
                    <div class="main-slider__content">
                        <h2 class="main-slider__title">Твой <span class="highlight-word">идеальный</span> комплект</h2>
                        <p class="main-slider__text">Закажите постельное белье по своим меркам и с уникальным дизайном</p>
                        <a href="tovars.php" class="main-slider__button">Перейти в каталог</a>
                    </div>
                </div>
                <div class="main-slider__slide">
                    <img src="img/main-slider-2.jpg" alt="Slide 2">
                    <div class="main-slider__content">
                        <h2 class="main-slider__title">Новая коллекция</h2>
                        <p class="main-slider__text">Специальные предложения для новых клиентов</p>
                        <a href="tovars.php" class="main-slider__button">Перейти в каталог</a>
                    </div>
                </div>
            </div>
            <div class="main-slider__dots">
                <span class="main-slider__dot active"></span>
                <span class="main-slider__dot"></span>
            </div>
        </section>

        <!-- Секция популярных товаров -->
        <section class="popular-products">
            <h2 class="section-title">Популярные товары</h2>
            <div class="popular-products__container">
                <div class="popular-products__slider" id="popular-products-slider">
                    <!-- Товары будут загружаться сюда через JS -->
                </div>
            </div>
            
            <!-- Кнопки навигации под слайдером -->
            <div class="popular-products__nav">
                <button class="popular-products__arrow popular-products__arrow--left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <button class="popular-products__arrow popular-products__arrow--right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </section>

        <!-- Секция преимуществ -->
        <section class="advantages">
            <h2 class="section-title">Наши преимущества</h2>
            <div class="advantages__container">
                <div class="advantage">
                    <img src="img/advantage1.png" alt="Преимущество 1" class="advantage__icon">
                    <p class="advantage__text">Индивидуальный пошив белья</p>
                </div>
                <div class="advantage">
                    <img src="img/advantage2.png" alt="Преимущество 2" class="advantage__icon">
                    <p class="advantage__text">Собственное производство</p>
                </div>
                <div class="advantage">
                    <img src="img/advantage3.png" alt="Преимущество 3" class="advantage__icon">
                    <p class="advantage__text">Материал - 100% хлопок (сатин)</p>
                </div>
                <div class="advantage">
                    <img src="img/advantage4.png" alt="Преимущество 4" class="advantage__icon">
                    <p class="advantage__text">Доставка по все России</p>
                </div>
                <div class="advantage">
                    <img src="img/advantage5.png" alt="Преимущество 5" class="advantage__icon">
                    <p class="advantage__text">Гарантия качества</p>
                </div>
            </div>
        </section>

        <!-- Секция отзывов -->
        <section class="reviews">
            <h2 class="section-title">Отзывы</h2>
            <div class="reviews__container">
                <div class="review">
                    <div class="review__content">
                        <h3 class="review__author">Анна</h3>
                        <div class="review__stars">★★★★★</div>
                        <p class="review__text">Очень довольна покупкой! Качество на высоте, доставка быстрая. Обязательно буду заказывать ещё.</p>
                        <p class="review__date">15.03.2023</p>
                    </div>
                    <img src="img/review1.png" alt="Фото отзыва" class="review__image">
                </div>
                <div class="review">
                    <div class="review__content">
                        <h3 class="review__author">Михаил</h3>
                        <div class="review__stars">★★★★☆</div>
                        <p class="review__text">Хороший товар, соответствует описанию. Единственное - размер оказался немного маловат.</p>
                        <p class="review__date">22.02.2023</p>
                    </div>
                    <img src="img/review2.png" alt="Фото отзыва" class="review__image">
                </div>
            </div>
            <button class="reviews__add-button">Оставить отзыв</button>
        </section>
    </main>

<?php include 'includes/footer.php'; ?>

</body>
</html>