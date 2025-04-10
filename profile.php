<?php
session_start();
require_once 'config/db.php';

// Проверка авторизации
if (!isset($_SESSION['user_email'])) {
    header('Location: login.php');
    exit();
}

$success_message = '';
$error_message = '';

// Получение данных пользователя
try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$_SESSION['user_email']]);
    $user = $stmt->fetch();
} catch(PDOException $e) {
    $error_message = 'Ошибка при получении данных пользователя';
}

// Обработка смены пароля
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_password'])) {
    $current_password = $_POST['current_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Проверка текущего пароля
    if (!password_verify($current_password, $user['password'])) {
        $error_message = 'Неверный текущий пароль';
    } elseif (strlen($new_password) < 6) {
        $error_message = 'Новый пароль должен быть не менее 6 символов';
    } elseif ($new_password !== $confirm_password) {
        $error_message = 'Пароли не совпадают';
    } else {
        try {
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
            $stmt->execute([$hashed_password, $_SESSION['user_email']]);
            $success_message = 'Пароль успешно изменен';
        } catch(PDOException $e) {
            $error_message = 'Ошибка при изменении пароля';
        }
    }
}

// Обработка выхода
if (isset($_GET['logout'])) {
    session_destroy();
    setcookie('user_email', '', time() - 3600, '/');
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Профиль - Sweet Dreams</title>
    <link rel="stylesheet" href="styles.css">
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
    
    <main class="main-container">
        <div class="profile-container">
            <h1>Профиль пользователя</h1>
            
            <?php if ($success_message): ?>
                <div class="success-message"><?php echo $success_message; ?></div>
            <?php endif; ?>

            <?php if ($error_message): ?>
                <div class="error-message"><?php echo $error_message; ?></div>
            <?php endif; ?>

            <div class="profile-info">
                <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
            </div>

            <div class="profile-section">
                <h2>Смена пароля</h2>
                <form method="POST" class="auth-form">
                    <input type="password" name="current_password" placeholder="Текущий пароль" required>
                    <input type="password" name="new_password" placeholder="Новый пароль" required>
                    <input type="password" name="confirm_password" placeholder="Подтвердите новый пароль" required>
                    <button type="submit" name="change_password" class="auth-button">Изменить пароль</button>
                </form>
            </div>

            <div class="profile-actions">
                <a href="?logout=1" class="logout-button">Выйти</a>
            </div>
        </div>
    </main>

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