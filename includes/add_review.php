<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = (int)$_POST['product_id'];
    $author_name = trim($_POST['author_name']);
    $review_text = trim($_POST['review_text']);
    $rating = (int)$_POST['rating'];

    // Валидация данных
    if (empty($author_name) || empty($review_text) || $rating < 1 || $rating > 5) {
        die("Неверные данные отзыва");
    }

    try {
        // Добавляем отзыв
        $stmt = $pdo->prepare("INSERT INTO reviews (product_id, author_name, text, rating, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$product_id, $author_name, $review_text, $rating]);

        // Обновляем рейтинг товара
        $stmt = $pdo->prepare("UPDATE products SET rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?) WHERE id = ?");
        $stmt->execute([$product_id, $product_id]);

        // Перенаправляем обратно на страницу товара
        header("Location: /pages/product.php?id=" . $product_id);
        exit();
    } catch(PDOException $e) {
        die("Ошибка при добавлении отзыва: " . $e->getMessage());
    }
}
?> 