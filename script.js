
        document.addEventListener('DOMContentLoaded', function() {
    
            const navItems = document.querySelectorAll('.bottom-nav-item');
            navItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    const megaMenu = this.querySelector('.mega-menu');
                    if (megaMenu) {
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

  
            const burgerMenu = document.querySelector('.burger-menu');
            const mobileMenu = document.querySelector('.mobile-menu');
            const mobileOverlay = document.querySelector('.mobile-overlay');
            const accordion = document.querySelector('#mobileMenuAccordion');

           const topNavItems = document.querySelectorAll('.top-nav .nav-item');
            const bottomNavItems = document.querySelectorAll('.bottom-nav-item:not(:last-child)'); // Exclude calculator

 topNavItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const dropdownMenu = this.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.style.display = 'block';
        }
    });
    item.addEventListener('mouseleave', function() {
        const dropdownMenu = this.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }
    });
});

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
