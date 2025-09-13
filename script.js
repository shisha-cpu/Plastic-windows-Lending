document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    const topNavItems = document.querySelectorAll('.top-nav .nav-item');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');
    let activeMegaMenu = null;

    // Function to hide all mega menus
    function hideAllMegaMenus() {
        navItems.forEach(item => {
            const megaMenu = item.querySelector('.mega-menu');
            if (megaMenu) {
                megaMenu.style.display = 'none';
            }
        });
        activeMegaMenu = null;
    }

    // Function to hide all dropdown menus
    function hideAllDropdownMenus() {
        topNavItems.forEach(item => {
            const dropdownMenu = item.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.style.display = 'none';
            }
        });
    }

    // Function to check if mouse is inside an element
    function isMouseInsideElement(event, element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        return (
            mouseX >= rect.left &&
            mouseX <= rect.right &&
            mouseY >= rect.top &&
            mouseY <= rect.bottom
        );
    }

    // Hover events for bottom navigation items
    navItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const megaMenu = this.querySelector('.mega-menu');
            if (megaMenu) {
                hideAllMegaMenus(); // Сначала скрываем все остальные меню
                const bottomNavRect = bottomNav.getBoundingClientRect();
                const bottomNavBottom = bottomNavRect.bottom;
                megaMenu.style.top = `${bottomNavBottom - 2}px`;
                megaMenu.style.display = 'block';
                activeMegaMenu = megaMenu;
            }
        });

        item.addEventListener('mouseleave', function(event) {
            const megaMenu = this.querySelector('.mega-menu');
            if (megaMenu) {
                // Проверяем, не находится ли мышь внутри мега-меню
                setTimeout(() => {
                    if (!isMouseInsideElement(event, megaMenu)) {
                        megaMenu.style.display = 'none';
                        if (activeMegaMenu === megaMenu) {
                            activeMegaMenu = null;
                        }
                    }
                }, 100);
            }
        });
    });

    // Добавляем обработчики для самого мега-меню
    document.querySelectorAll('.mega-menu').forEach(megaMenu => {
        megaMenu.addEventListener('mouseenter', function() {
            // При входе в мега-меню оставляем его открытым
            this.style.display = 'block';
        });

        megaMenu.addEventListener('mouseleave', function() {
            // При выходе из мега-меню скрываем его
            this.style.display = 'none';
            if (activeMegaMenu === this) {
                activeMegaMenu = null;
            }
        });
    });

    // Hover events for top navigation items
    topNavItems.forEach(item => {
        const dropdownMenu = item.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            item.addEventListener('mouseenter', function() {
                dropdownMenu.style.display = 'block';
            });

            item.addEventListener('mouseleave', function(event) {
                // Delay hiding to allow checking if mouse enters dropdown
                setTimeout(() => {
                    if (!isMouseInsideElement(event, dropdownMenu)) {
                        dropdownMenu.style.display = 'none';
                    }
                }, 100);
            });

            // Keep dropdown open if mouse enters it
            dropdownMenu.addEventListener('mouseenter', function() {
                dropdownMenu.style.display = 'block';
            });

            // Hide dropdown when mouse leaves it
            dropdownMenu.addEventListener('mouseleave', function() {
                dropdownMenu.style.display = 'none';
            });
        }
    });

    // Изменяем обработчик скролла - теперь он не закрывает активное мега-меню
    window.addEventListener('scroll', function(event) {
        // Не скрываем мега-меню при скролле, если оно активно
        hideAllDropdownMenus(); // Только выпадающие меню скрываем
        
        // Обновляем позицию активного мега-меню при скролле
        if (activeMegaMenu) {
            const bottomNavRect = bottomNav.getBoundingClientRect();
            const bottomNavBottom = bottomNavRect.bottom;
            activeMegaMenu.style.top = `${bottomNavBottom - 2}px`;
        }
    });

    // Track mouse position for scroll handling
    window.addEventListener('mousemove', function(event) {
        window.lastMouseX = event.clientX;
        window.lastMouseY = event.clientY;
    });

    // Mobile menu handling
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const accordion = document.querySelector('#mobileMenuAccordion');
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item:not(:last-child)');

    bottomNavItems.forEach((item, index) => {
        const link = item.querySelector('.bottom-nav-link');
        const megaMenu = item.querySelector('.mega-menu');
        if (link && megaMenu) {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            accordionItem.innerHTML = `
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#mobile-bottom-${index}">
                        ${link.textContent}
                    </button>
                </h2>
                <div id="mobile-bottom-${index}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        ${megaMenu.querySelector('.d-flex').innerHTML}
                    </div>
                </div>
            `;
            accordion.appendChild(accordionItem);
        }
    });

    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });
    }

    if (mobileMenu) {
        mobileMenu.querySelectorAll('.accordion-body a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
            });
        });

        const mobileCalcBtn = mobileMenu.querySelector('.calc-btn');
        if (mobileCalcBtn) {
            mobileCalcBtn.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
            });
        }
    }
});