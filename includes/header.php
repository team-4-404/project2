<!DOCTYPE html>
<header class="header">
    <div class="container">
        <div class="logo">
            <a href="../index.php">
                <span>404</span>
            </a>
        </div>
        <nav class="nav">
            <ul>
                <li><a href="../index.php">Главная</a></li>
                <li><a href="../tovars.php">Каталог</a></li>
            </ul>
        </nav>
        <div class="search-box">
            <input type="text" placeholder="Поиск...">
            <button type="submit">🔍</button>
        </div>
        <div class="icons">
            <?php
            session_start();
            if (isset($_SESSION['user_email'])) {
                echo '<a href="profile.php">
                    <img src="img/user.png" alt="Личный кабинет">
                </a>';
            } else {
                echo '<a href="register.php">
                    <img src="img/user.png" alt="Регистрация">
                </a>';
            }
            ?>
            <a href="cart.php" class="cart">
                <img src="img/korzina.png" alt="Корзина">
                <span class="cart-count">0</span>
            </a>
        </div>
    </div>
</header>