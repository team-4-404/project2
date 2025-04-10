<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Корзина</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>

<?php include 'includes/header.php'; ?>

    <main class="cart-page">
        <div class="containerr">
                <div class="cart-items" id="cart-items">
                <!-- Товары будут загружаться сюда через JS -->
                
                </div>
            
                <div class="cart-summary">
                    <h2>Итого</h2>
                    <div class="summary-row">
                        <span>Товары</span>
                        <span id="total-items">0</span>
                    </div>
                    <div class="summary-row">
                        <span>Сумма</span>
                        <span id="total-price">0 ₽</span>
                    </div>
                    <button class="btn-primary" id="checkout-btn">Оформить заказ</button>
                </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>

</body>
</html>