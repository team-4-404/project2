document.addEventListener("DOMContentLoaded", function () {
    // Получаем элементы модального окна
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-image");
    const closeBtn = document.querySelector(".close");

    // Получаем только изображения из конкретных классов
    const mainImage = document.querySelector(".main-image img");
    const smallImages = document.querySelectorAll(".small-images img");

    // Добавляем обработчик клика на главное изображение
    if (mainImage) {
        mainImage.addEventListener("click", function () {
            modal.style.display = "block"; // Показываем модальное окно
            modalImg.src = this.src; // Устанавливаем изображение в модальное окно
        });
    }

    // Добавляем обработчик клика на маленькие изображения
    smallImages.forEach(img => {
        img.addEventListener("click", function () {
            modal.style.display = "block"; // Показываем модальное окно
            modalImg.src = this.src; // Устанавливаем изображение в модальное окно
        });
    });

    // Закрытие модального окна при клике на крестик
    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Закрытие модального окна при клике вне изображения
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});