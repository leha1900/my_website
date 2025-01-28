document.addEventListener("DOMContentLoaded", function() {
    fetch("partials/navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки файла navbar.html");
            }
            return response.text(); 
        })
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            initializeMobileMenu(); // Инициализация мобильного меню после загрузки навбара
            initializeDropdowns(); // Инициализация выпадающих меню
        })
        .catch(error => {
            console.error("Ошибка:", error.message);
        });

    // Инициализация мобильного меню
    function initializeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const navbarMenu = document.querySelector('.navbar-menu');

        if (mobileMenu && navbarMenu) {
            mobileMenu.addEventListener('click', function () {
                mobileMenu.classList.toggle('is-active');
                navbarMenu.classList.toggle('active');
            });
        }
    }

    // Инициализация выпадающих меню на мобильных устройствах
    function initializeDropdowns() {
        const dropdownItems = document.querySelectorAll('.navbar-item.dropdown');

        dropdownItems.forEach(function(item) {
            const link = item.querySelector('.navbar-link');
            const dropdownMenu = item.querySelector('.dropdown-menu');

            // Добавляем обработчик клика только на мобильных устройствах
            link.addEventListener('click', function(e) {
                // Проверяем ширину окна для определения мобильного устройства
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Предотвращаем переход по ссылке
                    dropdownMenu.classList.toggle('active'); // Показываем/скрываем подменю
                }
            });
        });
    }

    // Обновление состояния выпадающих меню при изменении размера окна
    window.addEventListener('resize', function() {
        const dropdownMenus = document.querySelectorAll('.dropdown-menu.active');
        dropdownMenus.forEach(function(menu) {
            menu.classList.remove('active');
        });

        const mobileMenu = document.getElementById('mobile-menu');
        const navbarMenu = document.querySelector('.navbar-menu');
        if (window.innerWidth > 768 && navbarMenu.classList.contains('active')) {
            navbarMenu.classList.remove('active');
            mobileMenu.classList.remove('is-active');
        }
    });
});

