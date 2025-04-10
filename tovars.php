<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sweet Dreams</title>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js" defer></script>
</head>
<body>

<header class="header">
        <div class="container">
            <!-- Логотип -->
            <div class="logo">
                <a href="index.html">
                    <img src="img/logo.jpg" alt="Sweet Dreams">
                    <span>Sweet dreams</span>
                </a>
            </div>
    
            <!-- Навигация -->
            <nav class="nav">
                <ul>
                    <li><a href="about.php">О компании</a></li>
                    <li><a href="tovars.php">Каталог</a></li>
                </ul>
            </nav>
    
            <!-- Поиск -->
            <div class="search-box">
                <input type="text" placeholder="Введите категорию или товар" id="search-input">
                <button type="submit" id="search-button">🔍</button>
            </div>
    
            <!-- Иконки пользователя и корзины -->
            <div class="icons">
                <a href="profile.php">
                    <img src="img/user.png" alt="Личный кабинет">
                </a>
                <a href="cart.html" class="cart">
                    <img src="img/korzina.png" alt="Корзина">
                    <span class="cart-count">0</span>
                </a>
            </div>
        </div>
    </header>

<div class="catalog-container">
    <h1>Каталог</h1>

    <!-- Вкладки + Выпадающий список + Конструктор -->
    <div class="tabs-container">
            <select id="sort-select">
                <option value="popular">По популярности</option>
                <option value="cheap">Сначала дешевые</option>
                <option value="expensive">Сначала дорогие</option>
                <option value="new">Новинки</option>
            </select>
            <div class="tabs">
                <button class="tab" onclick="changeCategory('komplekty', this)">Комплекты</button>
                <button class="tab" onclick="changeCategory('prostyni', this)">Простыни</button>
                <button class="tab" onclick="changeCategory('pododeyalniki', this)">Пододеяльники</button>
                <button class="tab" onclick="changeCategory('navolochki', this)">Наволочки</button>
            </div>
    </div>

    <div class="catalog-layout">
        
        <!-- Боковая панель с фильтрами -->
        <aside class="filters">
            <form id="filter-form">
                <!-- Цена -->
                <div class="filter-section">
                    <h3>Цена</h3>
                    <div class="price-inputs">
                        <input type="text" placeholder="от 3500">
                        <input type="text" placeholder="до 6000">
                    </div>
                </div>

                <!-- Размер -->
                <div class="filter-section size-filter">
                    <h3>Размер</h3>
                    <div class="size-group">
                        <h4>Комплекты</h4>
                        <label><input type="checkbox" name="size" value="1 СП"> 1 СП</label>
                        <label><input type="checkbox" name="size" value="2 СП"> 2 СП</label>
                        <label><input type="checkbox" name="size" value="ЕВРО"> ЕВРО</label>
                        </div>

                        <div class="size-group">
                        <h4>Простыни</h4>
                        <label><input type="checkbox" name="size" value="200x220"> 200x220 см</label>
                        <label><input type="checkbox" name="size" value="160x200"> 160x200 см</label>
                        <label><input type="checkbox" name="size" value="180x200"> 180x200 см</label>
                        </div>

                        <div class="size-group">
                        <h4>Пододеяльники</h4>
                        <label><input type="checkbox" name="size" value="145x215"> 145x215 см</label>
                        <label><input type="checkbox" name="size" value="155x215"> 155x215 см</label>
                        <label><input type="checkbox" name="size" value="160x210"> 160x210 см</label>
                        </div>

                        <div class="size-group">
                        <h4>Наволочки</h4>
                        <label><input type="checkbox" name="size" value="50x70"> 50x70 см</label>
                        <label><input type="checkbox" name="size" value="40x60"> 40x60 см</label>
                        </div>
                    </div>
                

                <!-- Цвет -->
                <div class="filter-section">
                    <h3>Цвет</h3>
                    <div class="color-options">
                        <span class="color-circle" style="background: #6fc7ff;"></span>
                        <span class="color-circle" style="background: #9acd32;"></span>
                        <span class="color-circle" style="background: #ffffff; border: 1px solid #ccc;"></span>
                        <span class="color-circle" style="background: #f08080;"></span>
                        <span class="color-circle" style="background: #ff4500;"></span>
                        <span class="color-circle" style="background: #e5c29f;"></span>
                        <span class="color-circle" style="background: #8b4513;"></span>
                        <span class="color-circle" style="background: #000000;"></span>
                    </div>
                </div>

                <!-- В наличии -->
                <div class="filter-section">
                    <label class="checkbox-label">
                        <input type="checkbox"> В наличии
                    </label>
                </div>

                <!-- Кнопки -->
                <button type="submit" class="apply-button">Применить</button>
                <button type="reset" class="reset-button">Сбросить всё</button>
            </form>
        </aside>

        <div class="products-container" id="product-list">
            <!-- Здесь будут подгружаться товары -->
        </div>
    </div>
        <!-- Добавляем пагинацию -->
        <div class="pagination" id="pagination">
            <button class="pagination-prev" disabled>← Назад</button>
            <div class="pagination-pages"></div>
            <button class="pagination-next">Вперед →</button>
        </div>
</div>
    <footer class="footer">
        <div class="footer__container">
            <div class="footer__contacts">
                <h3>Контакты</h3>
                <p>Телефон: +7 (123) 456-78-90</p>
                <p>Email: info@sweetdreams.ru</p>
            </div>
            <div class="footer__schedule">
                <h3>График работы</h3>
                <p>Пн-Пт: 9:00 - 20:00</p>
                <p>Сб-Вс: 10:00 - 18:00</p>
            </div>
            <div class="footer__social">
                <h3>Мы в социальных сетях</h3>
                <div class="social-icons">
                    <a href="#"><img src="img/vk.png" alt="VK"></a>
                    <a href="#"><img src="img/instagram.png" alt="Instagram"></a>
                    <a href="#"><img src="img/telegram.png" alt="Telegram"></a>
                </div>
            </div>
        </div>
        <div class="footer__copyright">
            <hr>
            <p>© Sweet Dreams, 2023. Все права защищены.</p>
        </div>
    </footer>

</body>
</html>
