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
    <?php include 'header.php'; ?>
    
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

    <?php include 'footer.php'; ?>
</body>
</html> 