<?php
session_start();
require_once 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $error = '';

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_email'] = $user['email'];
            
            if (isset($_POST['remember'])) {
                // Установка cookie на 30 дней
                setcookie('user_email', $email, time() + (86400 * 30), "/");
            }
            
            header('Location: profile.php');
            exit();
        } else {
            $error = 'Неверный email или пароль';
        }
    } catch(PDOException $e) {
        $error = 'Ошибка при входе. Попробуйте позже.';
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход - Sweet Dreams</title>
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
        <div class="auth-container">
            <h1>Профиль</h1>
            <div class="auth-tabs">
                <a href="login.php" class="tab active">Вход</a>
                <a href="register.php" class="tab">Регистрация</a>
            </div>
            
            <?php if (isset($_SESSION['success_message'])): ?>
                <div class="success-message"><?php echo $_SESSION['success_message']; ?></div>
                <?php unset($_SESSION['success_message']); ?>
            <?php endif; ?>

            <?php if (!empty($error)): ?>
                <div class="error-message"><?php echo $error; ?></div>
            <?php endif; ?>

            <form method="POST" class="auth-form">
                <input type="email" name="email" placeholder="email" required>
                <input type="password" name="password" placeholder="пароль" required>
                <label class="remember-me">
                    <input type="checkbox" name="remember"> Запомнить меня
                </label>
                <button type="submit" class="auth-button">Войти</button>
            </form>
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