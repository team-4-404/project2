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
   
<?php include 'includes/header.php'; ?>
    
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

    <?php include 'includes/footer.php'; ?>

</body>
</html> 