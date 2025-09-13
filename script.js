document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    const topNavItems = document.querySelectorAll('.top-nav .nav-item');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');

    // Function to hide all mega menus
    function hideAllMegaMenus() {
        navItems.forEach(item => {
            const megaMenu = item.querySelector('.mega-menu');
            if (megaMenu) {
                megaMenu.style.display = 'none';
            }
        });
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
                const bottomNavRect = bottomNav.getBoundingClientRect();
                const bottomNavBottom = bottomNavRect.bottom;
                megaMenu.style.top = `${bottomNavBottom - 2}px`;
                megaMenu.style.display = 'block';
            }
        });

        item.addEventListener('mouseleave', function() {
            const megaMenu = this.querySelector('.mega-menu');
            if (megaMenu) {
                megaMenu.style.display = 'none';
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

    // Handle scroll event to keep dropdown open if mouse is inside
    window.addEventListener('scroll', function(event) {
        hideAllMegaMenus(); // Hide mega menus as before
        topNavItems.forEach(item => {
            const dropdownMenu = item.querySelector('.dropdown-menu');
            if (dropdownMenu && dropdownMenu.style.display === 'block') {
                // Get current mouse position
                const mouseEvent = { clientX: window.lastMouseX, clientY: window.lastMouseY };
                if (!isMouseInsideElement(mouseEvent, dropdownMenu) && !isMouseInsideElement(mouseEvent, item)) {
                    dropdownMenu.style.display = 'none';
                }
            }
        });
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

    burgerMenu.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
    });

    mobileOverlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
    });

    mobileMenu.querySelectorAll('.accordion-body a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });
    });

    mobileMenu.querySelector('.calc-btn').addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
    });
});