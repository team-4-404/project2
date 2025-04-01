<?php
require_once 'config/db.php';

function getProducts($category = null, $sort = 'popular', $filters = []) {
    global $pdo;
    
    $sql = "SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE 1=1";
    $params = [];

    // Фильтр по категории
    if ($category) {
        $sql .= " AND c.slug = ?";
        $params[] = $category;
    }

    // Фильтр по цене
    if (!empty($filters['price_min'])) {
        $sql .= " AND p.price >= ?";
        $params[] = $filters['price_min'];
    }
    if (!empty($filters['price_max'])) {
        $sql .= " AND p.price <= ?";
        $params[] = $filters['price_max'];
    }

    // Фильтр по размеру
    if (!empty($filters['size'])) {
        $sql .= " AND p.size = ?";
        $params[] = $filters['size'];
    }

    // Фильтр по цвету
    if (!empty($filters['color'])) {
        $sql .= " AND p.color = ?";
        $params[] = $filters['color'];
    }

    // Фильтр по наличию
    if (isset($filters['in_stock']) && $filters['in_stock']) {
        $sql .= " AND p.in_stock = 1";
    }

    // Сортировка
    switch ($sort) {
        case 'cheap':
            $sql .= " ORDER BY p.price ASC";
            break;
        case 'expensive':
            $sql .= " ORDER BY p.price DESC";
            break;
        case 'new':
            $sql .= " ORDER BY p.created_at DESC";
            break;
        default: // popular
            $sql .= " ORDER BY p.id DESC"; // В будущем можно добавить поле popularity
    }

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        return [];
    }
}

// API endpoint для получения товаров
if (isset($_GET['ajax'])) {
    header('Content-Type: application/json');
    
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'popular';
    $filters = [
        'price_min' => isset($_GET['price_min']) ? floatval($_GET['price_min']) : null,
        'price_max' => isset($_GET['price_max']) ? floatval($_GET['price_max']) : null,
        'size' => isset($_GET['size']) ? $_GET['size'] : null,
        'color' => isset($_GET['color']) ? $_GET['color'] : null,
        'in_stock' => isset($_GET['in_stock']) ? true : false
    ];

    $products = getProducts($category, $sort, $filters);
    echo json_encode($products);
    exit();
}
?> 