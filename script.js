document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    const topNavItems = document.querySelectorAll('.top-nav .nav-item');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');
    let activeMegaMenu = null;

    function isMobile() {
        return window.innerWidth < 768;
    }

    function hideAllMegaMenus() {
        if (!isMobile()) {
            navItems.forEach(item => {
                const megaMenu = item.querySelector('.mega-menu');
                if (megaMenu) {
                    megaMenu.style.display = 'none';
                }
            });
            activeMegaMenu = null;
        }
    }

    function hideAllDropdownMenus() {
        if (!isMobile()) {
            topNavItems.forEach(item => {
                const dropdownMenu = item.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.display = 'none';
                }
            });
        }
    }

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
            if (!isMobile()) {
                const megaMenu = this.querySelector('.mega-menu');
                if (megaMenu) {
                    hideAllMegaMenus();
                    const bottomNavRect = bottomNav.getBoundingClientRect();
                    const bottomNavBottom = bottomNavRect.bottom;
                    megaMenu.style.top = `${bottomNavBottom - 2}px`;
                    megaMenu.style.display = 'block';
                    activeMegaMenu = megaMenu;
                }
            }
        });

        item.addEventListener('mouseleave', function(event) {
            if (!isMobile()) {
                const megaMenu = this.querySelector('.mega-menu');
                if (megaMenu) {
                    setTimeout(() => {
                        if (!isMouseInsideElement(event, megaMenu)) {
                            megaMenu.style.display = 'none';
                            if (activeMegaMenu === megaMenu) {
                                activeMegaMenu = null;
                            }
                        }
                    }, 100);
                }
            }
        });
    });

    document.querySelectorAll('.mega-menu').forEach(megaMenu => {
        megaMenu.addEventListener('mouseenter', function() {
            if (!isMobile()) {
                this.style.display = 'block';
            }
        });

        megaMenu.addEventListener('mouseleave', function() {
            if (!isMobile()) {
                this.style.display = 'none';
                if (activeMegaMenu === this) {
                    activeMegaMenu = null;
                }
            }
        });
    });

    topNavItems.forEach(item => {
        const dropdownMenu = item.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            item.addEventListener('mouseenter', function() {
                if (!isMobile()) {
                    dropdownMenu.style.display = 'block';
                }
            });

            item.addEventListener('mouseleave', function(event) {
                if (!isMobile()) {
                    setTimeout(() => {
                        if (!isMouseInsideElement(event, dropdownMenu)) {
                            dropdownMenu.style.display = 'none';
                        }
                    }, 100);
                }
            });

            dropdownMenu.addEventListener('mouseenter', function() {
                if (!isMobile()) {
                    dropdownMenu.style.display = 'block';
                }
            });

            dropdownMenu.addEventListener('mouseleave', function() {
                if (!isMobile()) {
                    dropdownMenu.style.display = 'none';
                }
            });
        }
    });

    window.addEventListener('scroll', function() {
        if (!isMobile() && activeMegaMenu) {
            const bottomNavRect = bottomNav.getBoundingClientRect();
            const bottomNavBottom = bottomNavRect.bottom;
            activeMegaMenu.style.top = `${bottomNavBottom - 2}px`;
        }
        hideAllDropdownMenus();
    });

    window.addEventListener('resize', function() {
        hideAllMegaMenus();
        hideAllDropdownMenus();
        if (isMobile()) {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
        }
    });

    window.addEventListener('mousemove', function(event) {
        window.lastMouseX = event.clientX;
        window.lastMouseY = event.clientY;
    });

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
                        ${link.textContent.replace(' <span class="arrow"><i class="fas fa-chevron-down"></i></span>', '')}
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