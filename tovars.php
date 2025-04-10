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

<div class="catalog-container">
    <h1>Каталог</h1>

    <!-- Вкладки + Выпадающий список + Конструктор -->
    <form id="filter-form">
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

                <!-- Кнопка -->
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

<?php include 'includes/footer.php'; ?>

</body>
</html>
