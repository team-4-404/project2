<?php
session_start();
require_once 'config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $error = '';

    // Отладочная информация
    error_log("Email: " . $email);
    error_log("Password length: " . strlen($password));

    // Проверка email
    if (empty($email)) {
        $error = 'Email не может быть пустым';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Неверный формат email';
    }

    // Проверка пароля
    if (empty($password)) {
        $error = 'Пароль не может быть пустым';
    } elseif (strlen($password) < 6) {
        $error = 'Пароль должен быть не менее 6 символов';
    }

    // Проверка совпадения паролей
    if ($password !== $confirm_password) {
        $error = 'Пароли не совпадают';
    }

    if (empty($error)) {
        try {
            // Проверка существования email
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                $error = 'Пользователь с таким email уже существует';
            } else {
                // Хеширование пароля и сохранение пользователя
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                error_log("Hashed password: " . $hashed_password);
                
                $stmt = $pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
                $result = $stmt->execute([$email, $hashed_password]);
                
                if ($result) {
                    $_SESSION['success_message'] = 'Регистрация успешна! Теперь вы можете войти.';
                    header('Location: login.php');
                    exit();
                } else {
                    $error = 'Ошибка при сохранении данных в базу';
                }
            }
        } catch(PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            $error = 'Ошибка при регистрации. Попробуйте позже.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация - Sweet Dreams</title>
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
                <a href="login.php" class="tab">Вход</a>
                <a href="register.php" class="tab active">Регистрация</a>
            </div>
            
            <?php if (!empty($error)): ?>
                <div class="error-message"><?php echo $error; ?></div>
            <?php endif; ?>

            <form method="POST" class="auth-form">
                <input type="email" name="email" placeholder="email" required>
                <input type="password" name="password" placeholder="пароль" required>
                <input type="password" name="confirm_password" placeholder="еще раз пароль" required>
                <label class="remember-me">
                    <input type="checkbox" name="remember"> Запомнить меня
                </label>
                <button type="submit" class="auth-button">Зарегистрироваться</button>
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