<?php
require_once '../includes/db.php';
require_once '../includes/header.php';

// Получаем ID товара из URL
$product_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Получаем данные о товаре из базы данных
$stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
$stmt->execute([$product_id]);
$product = $stmt->fetch(PDO::ATTR_DEFAULT_FETCH_MODE);

if (!$product) {
    die("Товар не найден");
}

// Устанавливаем заголовок страницы
$pageTitle = $product['name'];

// Получаем отзывы для товара
$stmt = $pdo->prepare("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC");
$stmt->execute([$product_id]);
$reviews = $stmt->fetchAll(PDO::ATTR_DEFAULT_FETCH_MODE);
?>

<div class="product-container">
    <a href="/catalog.php" class="back-to-catalog">Назад в каталог</a>

    <div class="product-content">
        <div class="product-images">
            <div class="main-image">
                <img id="main-image" src="<?php echo htmlspecialchars($product['main_image']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
            </div>
            <div class="small-images">
                <?php
                $images = json_decode($product['additional_images'], true);
                foreach ($images as $image) {
                    echo '<img class="small-image" src="' . htmlspecialchars($image) . '" alt="' . htmlspecialchars($product['name']) . '">';
                }
                ?>
            </div>
        </div>

        <div class="product-info">
            <h1 id="product-name"><?php echo htmlspecialchars($product['name']); ?></h1>
            <div class="product-meta">
                <p id="product-article">Артикул: <?php echo htmlspecialchars($product['article']); ?></p>
                <p class="rating">Рейтинг: <span id="product-rating"><?php echo number_format($product['rating'], 1); ?></span></p>
            </div>
            <div class="product-price">
                <p id="product-price">Цена: <?php echo number_format($product['price'], 0, ',', ' '); ?> ₽</p>
                <button class="buy-button" data-product-id="<?php echo $product['id']; ?>">Купить</button>
            </div>
            <div class="product-specs">
                <h3>Комплектация</h3>
                <ul id="product-specs">
                    <?php
                    $specs = json_decode($product['specifications'], true);
                    foreach ($specs as $spec) {
                        echo '<li>' . htmlspecialchars($spec) . '</li>';
                    }
                    ?>
                </ul>
            </div>
        </div>
    </div>

    <div class="tabs">
        <button class="tab-button active" data-tab="description">Описание</button>
        <button class="tab-button" data-tab="reviews">Отзывы</button>
    </div>

    <div class="tab-content" id="description">
        <h2>Описание</h2>
        <p id="product-description"><?php echo nl2br(htmlspecialchars($product['description'])); ?></p>
    </div>

    <div class="tab-content" id="reviews" style="display: none;">
        <h2>Отзывы</h2>
        <div class="reviews-list" id="reviews-list">
            <?php foreach ($reviews as $review): ?>
                <div class="review">
                    <h4><?php echo htmlspecialchars($review['author_name']); ?></h4>
                    <div class="rating">Оценка: <?php echo $review['rating']; ?>/5</div>
                    <p><?php echo nl2br(htmlspecialchars($review['text'])); ?></p>
                    <small><?php echo date('d.m.Y', strtotime($review['created_at'])); ?></small>
                </div>
            <?php endforeach; ?>
        </div>

        <form id="review-form" action="/includes/add_review.php" method="POST">
            <h3>Оставить отзыв</h3>
            <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
            <input type="text" name="author_name" placeholder="Ваше имя" required>
            <textarea name="review_text" placeholder="Ваш отзыв" required></textarea>
            <input type="number" name="rating" placeholder="Оценка (1-5)" min="1" max="5" required>
            <button type="submit">Отправить</button>
        </form>
    </div>
</div>

<?php require_once '../includes/footer.php'; ?> 