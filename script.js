document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    const topNavItems = document.querySelectorAll('.top-nav .nav-item');
    const header = document.querySelector('.header');
    const bottomNav = document.querySelector('.bottom-nav');
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileAccordion = document.querySelector('#mobileMenuAccordion');
    let activeMegaMenu = null;

    const isMobile = () => window.innerWidth < 768;

    const isMouseInsideElement = (event, element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );
    };

    const hideAllMegaMenus = () => {
        if (isMobile()) return;
        navItems.forEach(item => {
            const megaMenu = item.querySelector('.mega-menu');
            if (megaMenu) megaMenu.style.display = 'none';
        });
        activeMegaMenu = null;
    };

    const hideAllDropdownMenus = () => {
        if (isMobile()) return;
        topNavItems.forEach(item => {
            const dropdownMenu = item.querySelector('.dropdown-menu');
            if (dropdownMenu) dropdownMenu.style.display = 'none';
        });
    };

    const setupNavigation = () => {
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (isMobile()) return;
                const megaMenu = item.querySelector('.mega-menu');
                if (megaMenu) {
                    hideAllMegaMenus();
                    const bottomNavRect = bottomNav.getBoundingClientRect();
                    megaMenu.style.top = `${bottomNavRect.bottom - 2}px`;
                    megaMenu.style.display = 'block';
                    activeMegaMenu = megaMenu;
                }
            });

            item.addEventListener('mouseleave', event => {
                if (isMobile()) return;
                const megaMenu = item.querySelector('.mega-menu');
                if (megaMenu) {
                    setTimeout(() => {
                        if (!isMouseInsideElement(event, megaMenu)) {
                            megaMenu.style.display = 'none';
                            if (activeMegaMenu === megaMenu) activeMegaMenu = null;
                        }
                    }, 100);
                }
            });
        });

        document.querySelectorAll('.mega-menu').forEach(megaMenu => {
            megaMenu.addEventListener('mouseenter', () => {
                if (isMobile()) return;
                megaMenu.style.display = 'block';
            });

            megaMenu.addEventListener('mouseleave', () => {
                if (isMobile()) return;
                megaMenu.style.display = 'none';
                if (activeMegaMenu === megaMenu) activeMegaMenu = null;
            });
        });

        topNavItems.forEach(item => {
            const dropdownMenu = item.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                item.addEventListener('mouseenter', () => {
                    if (isMobile()) return;
                    dropdownMenu.style.display = 'block';
                });

                item.addEventListener('mouseleave', event => {
                    if (isMobile()) return;
                    setTimeout(() => {
                        if (!isMouseInsideElement(event, dropdownMenu)) {
                            dropdownMenu.style.display = 'none';
                        }
                    }, 100);
                });

                dropdownMenu.addEventListener('mouseenter', () => {
                    if (isMobile()) return;
                    dropdownMenu.style.display = 'block';
                });

                dropdownMenu.addEventListener('mouseleave', () => {
                    if (isMobile()) return;
                    dropdownMenu.style.display = 'none';
                });
            }
        });
    };

    const setupMobileMenu = () => {
        navItems.forEach((item, index) => {
            if (item === navItems[navItems.length - 1]) return;
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
                mobileAccordion.appendChild(accordionItem);
            }
        });

        burgerMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
        });

        mobileOverlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });

        mobileMenu.querySelectorAll('.accordion-body a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
            });
        });

        const mobileCalcBtn = mobileMenu.querySelector('.calc-btn');
        if (mobileCalcBtn) {
            mobileCalcBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
            });
        }
    };

    const setupWindowEvents = () => {
        window.addEventListener('scroll', () => {
            if (isMobile() || !activeMegaMenu) return;
            const bottomNavRect = bottomNav.getBoundingClientRect();
            activeMegaMenu.style.top = `${bottomNavRect.bottom - 2}px`;
            hideAllDropdownMenus();
        });

        window.addEventListener('resize', () => {
            hideAllMegaMenus();
            hideAllDropdownMenus();
            if (isMobile()) {
                mobileMenu.classList.remove('active');
                mobileOverlay.classList.remove('active');
            }
        });

        window.addEventListener('mousemove', event => {
            window.lastMouseX = event.clientX;
            window.lastMouseY = event.clientY;
        });
    };

    const setupLightbox = () => {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const photoItems = document.querySelectorAll('.photo-item');
        let currentIndex = 0;
        let scrollPosition = 0;

        const imageData = Array.from(photoItems).map(item => {
            const img = item.querySelector('img');
            return {
                src: img.getAttribute('data-large') || img.src,
                alt: img.alt
            };
        });

        const updateLightbox = () => {
            lightboxImg.src = imageData[currentIndex].src;
            lightboxCaption.textContent = imageData[currentIndex].alt;
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            window.scrollTo(0, scrollPosition);
        };

        photoItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                scrollPosition = window.scrollY;
                currentIndex = index;
                updateLightbox();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
            });
        });

        lightboxClose.addEventListener('click', event => {
            event.preventDefault();
            closeLightbox();
        });

        lightbox.addEventListener('click', event => {
            if (event.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
            if (!lightbox.classList.contains('active')) return;
            if (event.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + imageData.length) % imageData.length;
                updateLightbox();
            } else if (event.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % imageData.length;
                updateLightbox();
            }
        });

        prevBtn.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            currentIndex = (currentIndex - 1 + imageData.length) % imageData.length;
            updateLightbox();
        });

        nextBtn.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            currentIndex = (currentIndex + 1) % imageData.length;
            updateLightbox();
        });

        imageData.forEach(item => {
            const img = new Image();
            img.src = item.src;
        });
    };

    const setupCertificateModal = () => {
        const certificateModal = document.getElementById('certificateModal');
        const modalImage = document.getElementById('modalImage');
        const modalClose = document.querySelector('.modal-close');
        const modalContent = document.querySelector('.modal-content');

        const openCertificateModal = (imgSrc, imgAlt) => {
            if (!certificateModal || !modalImage) return;
            modalImage.src = imgSrc;
            modalImage.alt = imgAlt;
            certificateModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        const closeCertificateModal = () => {
            if (!certificateModal) return;
            certificateModal.style.display = 'none';
            document.body.style.overflow = '';
            modalImage.src = '';
        };

        document.querySelectorAll('.certificate-img').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openCertificateModal(img.src, img.alt));
        });

        modalClose.addEventListener('click', event => {
            event.stopPropagation();
            closeCertificateModal();
        });

        modalContent.addEventListener('click', event => {
            if (event.target !== modalImage && event.target !== modalClose) {
                closeCertificateModal();
            }
        });

        modalImage.addEventListener('click', event => event.stopPropagation());

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && certificateModal.style.display === 'flex') {
                closeCertificateModal();
            }
        });
    };

    const setupVideoModal = () => {
        const videoModal = document.getElementById('videoModal');
        const modalOverlay = document.getElementById('modalOverlay');
        const videoWrapper = document.getElementById('videoWrapper');
        const modalClose = document.getElementById('modalClose');
        const modalContent = document.querySelector('.modal-content');
        let isModalOpen = false;

        const openVideoModal = videoId => {
            if (!videoId) return;
            const iframe = document.createElement('iframe');
            iframe.src = `https://rutube.ru/play/embed/${videoId}`;
            iframe.allowFullscreen = true;
            iframe.allow = 'autoplay; fullscreen';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            videoWrapper.innerHTML = '';
            videoWrapper.appendChild(iframe);
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            isModalOpen = true;
        };

        const closeVideoModal = () => {
            videoModal.classList.remove('active');
            videoWrapper.innerHTML = '';
            document.body.style.overflow = '';
            isModalOpen = false;
        };

        document.querySelectorAll('.video-placeholder').forEach(placeholder => {
            let dragStartTime = 0;
            let isDragging = false;

            placeholder.addEventListener('mousedown', () => {
                dragStartTime = Date.now();
                isDragging = false;
            });

            placeholder.addEventListener('mousemove', () => {
                if (Date.now() - dragStartTime > 50) isDragging = true;
            });

            placeholder.addEventListener('click', () => {
                if (isDragging) return;
                const videoId = placeholder.getAttribute('data-video-id');
                if (videoId) openVideoModal(videoId);
            });
        });

        modalClose.addEventListener('click', event => {
            event.stopPropagation();
            closeVideoModal();
        });

        modalOverlay.addEventListener('click', closeVideoModal);

        videoModal.addEventListener('click', event => {
            if (event.target === videoModal) closeVideoModal();
        });

        modalContent.addEventListener('click', event => event.stopPropagation());

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && isModalOpen) closeVideoModal();
        });
    };

    const setupCalculator = () => {
        const heightSlider = document.getElementById('height-slider');
        const widthSlider = document.getElementById('width-slider');
        const heightValue = document.getElementById('height-value');
        const widthValue = document.getElementById('width-value');
        const totalPriceElement = document.getElementById('total-price');
        const constructionButtons = document.querySelectorAll('.construction-btn');
        const profileButtons = document.querySelectorAll('.profile-btn');
        const installationCheckbox = document.getElementById('installation');
        const windowsillCheckbox = document.getElementById('windowsill');
        const drainCheckbox = document.getElementById('drain');
        const mosquitoNetCheckbox = document.getElementById('mosquitoNet');
        const windowPreview = document.getElementById('window-preview');

        const basePricePerSqm = 5000;
        const constructionMultipliers = {
            straight: 1.0,
            corner: 1.3,
            'u-shaped': 1.5,
            heel: 1.7
        };
        const profileMultipliers = {
            rehau: 1.0,
            veka: 1.2,
            kbe70: 1.0,
            provedal: 0.9
        };
        const optionPrices = {
            installation: 3000,
            windowsill: 2500,
            drain: 1500,
            mosquitoNet: 2000
        };
        const constructionImages = {
            straight: './img/straight.jpg',
            corner: './img/corner.jpg',
            'u-shaped': './img/u-shaped.jpg',
            heel: './img/heel.jpg'
        };

        let currentConstruction = 'straight';
        let currentProfile = 'rehau';
        let currentHeight = 1.4;
        let currentWidth = 4.03;

        const updatePrice = () => {
            const area = currentHeight * currentWidth;
            let price = area * basePricePerSqm;
            price *= constructionMultipliers[currentConstruction];
            price *= profileMultipliers[currentProfile];
            if (installationCheckbox.checked) price += optionPrices.installation;
            if (windowsillCheckbox.checked) price += optionPrices.windowsill;
            if (drainCheckbox.checked) price += optionPrices.drain;
            if (mosquitoNetCheckbox.checked) price += optionPrices.mosquitoNet;
            totalPriceElement.textContent = Math.round(price).toLocaleString('ru-RU');
        };

        const updateSliderValue = (sliderId, valueId) => {
            const slider = document.getElementById(sliderId);
            const valueDisplay = document.getElementById(valueId);
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            const thumbSize = 30;

            const update = () => {
                const value = parseFloat(slider.value);
                valueDisplay.textContent = `${value.toFixed(1)} м`;
                const ratio = (value - min) / (max - min);
                if (sliderId === 'width-slider') {
                    const trackWidth = slider.getBoundingClientRect().width - thumbSize;
                    valueDisplay.style.left = `${ratio * trackWidth + thumbSize / 2}px`;
                    valueDisplay.style.top = '-30px';
                } else {
                    const container = slider.parentElement;
                    const sliderRect = slider.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    const visualTop = sliderRect.top - containerRect.top;
                    const visualHeight = sliderRect.height;
                    const trackHeight = visualHeight - thumbSize;
                    valueDisplay.style.top = `${visualTop + (1 - ratio) * trackHeight + thumbSize / 2}px`;
                    valueDisplay.style.left = '90px';
                }
            };

            slider.addEventListener('input', update);
            update();
        };

        heightSlider.addEventListener('input', () => {
            currentHeight = parseFloat(heightSlider.value);
            updatePrice();
        });

        widthSlider.addEventListener('input', () => {
            currentWidth = parseFloat(widthSlider.value);
            updatePrice();
        });

        constructionButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopImmediatePropagation();
                const constructionType = button.getAttribute('data-type');
                if (constructionType === currentConstruction) return;
                constructionButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentConstruction = constructionType;
                windowPreview.src = constructionImages[currentConstruction];
                updatePrice();
            });
        });

        profileButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                profileButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentProfile = button.getAttribute('data-profile');
                updatePrice();
            });
        });

        document.querySelectorAll('.clickable-option').forEach(option => {
            option.addEventListener('click', event => {
                if (event.target.tagName === 'INPUT' || event.target.tagName === 'LABEL') return;
                const checkbox = option.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            });
        });

        installationCheckbox.addEventListener('change', updatePrice);
        windowsillCheckbox.addEventListener('change', updatePrice);
        drainCheckbox.addEventListener('change', updatePrice);
        mosquitoNetCheckbox.addEventListener('change', updatePrice);

        updateSliderValue('width-slider', 'width-value');
        updateSliderValue('height-slider', 'height-value');
        updatePrice();
    };

    const setupProjectFilter = () => {
        const filterItems = document.querySelectorAll('.filter-item');
        const projectItems = document.querySelectorAll('.project-item');

        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                filterItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const filterValue = item.getAttribute('data-filter');
                projectItems.forEach(project => {
                    project.style.display = filterValue === 'all' || project.getAttribute('data-category') === filterValue ? 'flex' : 'none';
                });
            });
        });
    };

    const setupAccordion = () => {
        const accordionButtons = document.querySelectorAll('.accordion-button');

        accordionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-bs-target');
                const targetCollapse = document.querySelector(targetId);
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                const accordion = button.closest('.accordion');
                const parentId = targetCollapse.getAttribute('data-bs-parent');

                if (parentId) {
                    const parent = document.querySelector(parentId);
                    parent.querySelectorAll('.accordion-collapse.show').forEach(item => {
                        if (item !== targetCollapse && item.classList.contains('show')) {
                            item.style.height = `${item.scrollHeight}px`;
                            requestAnimationFrame(() => {
                                item.style.height = '0';
                                item.querySelector('.accordion-body').style.opacity = '0';
                                item.querySelector('.accordion-body').style.transform = 'translateY(-10px)';
                                item.classList.remove('show');
                                parent.querySelector(`[data-bs-target="#${item.id}"]`).classList.add('collapsed');
                            });
                        }
                    });
                }

                if (isExpanded) {
                    targetCollapse.style.height = `${targetCollapse.scrollHeight}px`;
                    requestAnimationFrame(() => {
                        targetCollapse.style.height = '0';
                        targetCollapse.querySelector('.accordion-body').style.opacity = '0';
                        targetCollapse.querySelector('.accordion-body').style.transform = 'translateY(-10px)';
                        targetCollapse.classList.remove('show');
                        button.classList.add('collapsed');
                        button.setAttribute('aria-expanded', 'false');
                    });
                } else {
                    button.classList.remove('collapsed');
                    button.setAttribute('aria-expanded', 'true');
                    targetCollapse.classList.add('show');
                    targetCollapse.style.height = '0';
                    requestAnimationFrame(() => {
                        targetCollapse.style.height = `${targetCollapse.scrollHeight}px`;
                        targetCollapse.querySelector('.accordion-body').style.opacity = '1';
                        targetCollapse.querySelector('.accordion-body').style.transform = 'translateY(0)';
                    });
                }

                targetCollapse.addEventListener('transitionend', () => {
                    if (targetCollapse.classList.contains('show')) {
                        targetCollapse.style.height = 'auto';
                    }
                }, { once: true });
            });
        });
    };

    const setupCarousel = ({ sectionSelector, itemSelector, prevBtnSelector, nextBtnSelector, indicatorsContainerSelector, slidesContainerSelector, visibleCountLogic }) => {
        const section = document.querySelector(sectionSelector);
        if (!section) return;

        const slidesContainer = section.querySelector(slidesContainerSelector);
        const items = section.querySelectorAll(itemSelector);
        const prevBtn = section.querySelector(prevBtnSelector);
        const nextBtn = section.querySelector(nextBtnSelector);
        const indicatorsContainer = section.querySelector(indicatorsContainerSelector);
        if (!slidesContainer || items.length === 0) return;

        let currentIndex = 0;
        let visibleCount = visibleCountLogic();
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationId = null;
        const threshold = 50;

        const updateVisibleCount = () => {
            const oldVisibleCount = visibleCount;
            visibleCount = visibleCountLogic();
            slidesContainer.style.setProperty('--visible-count', visibleCount);
            if (oldVisibleCount !== visibleCount) {
                currentIndex = Math.min(currentIndex, Math.max(0, items.length - visibleCount));
            }
            items.forEach(item => {
                item.style.flex = `0 0 ${100 / visibleCount}%`;
            });
            createIndicators();
            showSlide(currentIndex, false);
            updateButtonState();
        };

        const createIndicators = () => {
            if (!indicatorsContainer) return;
            indicatorsContainer.innerHTML = '';
            const totalIndicators = Math.max(1, Math.ceil(items.length / visibleCount));
            for (let i = 0; i < totalIndicators; i++) {
                const indicator = document.createElement('button');
                indicator.className = `custom-indicator${i === 0 ? ' active' : ''}`;
                indicator.setAttribute('aria-label', `Slide ${i + 1}`);
                indicator.addEventListener('click', () => showSlide(i * visibleCount));
                indicatorsContainer.appendChild(indicator);
            }
        };

        const showSlide = (index, animate = true) => {
            currentIndex = Math.max(0, Math.min(index, Math.max(0, items.length - visibleCount)));
            const translateX = -(currentIndex * (100 / visibleCount));
            prevTranslate = translateX;
            slidesContainer.style.transition = animate ? 'transform 0.5s ease' : 'none';
            slidesContainer.style.transform = `translateX(${translateX}%)`;
            updateIndicators();
            updateButtonState();
        };

        const updateIndicators = () => {
            if (!indicatorsContainer) return;
            const indicators = indicatorsContainer.querySelectorAll('.custom-indicator');
            const activeIndicator = Math.floor(currentIndex / visibleCount);
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === activeIndicator);
            });
        };

        const updateButtonState = () => {
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= items.length - visibleCount;
        };

        const startDrag = event => {
            startX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
            if (event.type !== 'touchstart') event.preventDefault();
            isDragging = true;
            slidesContainer.style.transition = 'none';
            animationId = requestAnimationFrame(animation);
        };

        const drag = event => {
            if (!isDragging) return;
            const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
            if (event.type !== 'touchmove') event.preventDefault();
            const deltaX = currentX - startX;
            const containerWidth = slidesContainer.parentElement.offsetWidth;
            currentTranslate = prevTranslate + (deltaX / containerWidth) * 100;
            const maxTranslate = 0;
            const minTranslate = -((items.length - visibleCount) * (100 / visibleCount));
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate + (currentTranslate - maxTranslate) * 0.3;
            } else if (currentTranslate < minTranslate) {
                currentTranslate = minTranslate + (currentTranslate - minTranslate) * 0.3;
            }
        };

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationId);
            const containerWidth = slidesContainer.parentElement.offsetWidth;
            const movedBy = (currentTranslate - prevTranslate) * containerWidth / 100;
            if (Math.abs(movedBy) > threshold) {
                showSlide(movedBy < 0 ? currentIndex + 1 : currentIndex - 1);
            } else {
                showSlide(currentIndex);
            }
        };

        const animation = () => {
            slidesContainer.style.transform = `translateX(${currentTranslate}%)`;
            if (isDragging) animationId = requestAnimationFrame(animation);
        };

        prevBtn?.addEventListener('click', () => showSlide(currentIndex - 1));
        nextBtn?.addEventListener('click', () => showSlide(currentIndex + 1));

        slidesContainer.addEventListener('mousedown', startDrag);
        slidesContainer.addEventListener('mousemove', drag);
        slidesContainer.addEventListener('mouseup', endDrag);
        slidesContainer.addEventListener('mouseleave', endDrag);
        slidesContainer.addEventListener('touchstart', startDrag, { passive: false });
        slidesContainer.addEventListener('touchmove', drag, { passive: false });
        slidesContainer.addEventListener('touchend', endDrag);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateVisibleCount, 250);
        });

        updateVisibleCount();
    };

    const setupCarousels = () => {
        setupCarousel({
            sectionSelector: '.reviews-section',
            itemSelector: '.review-slide',
            prevBtnSelector: '.prev-btn',
            nextBtnSelector: '.next-btn',
            indicatorsContainerSelector: '.custom-indicators',
            slidesContainerSelector: '.reviews-slider',
            visibleCountLogic: () => window.innerWidth < 768 ? 1 : 3
        });

        setupCarousel({
            sectionSelector: '.video-reviews-section',
            itemSelector: '.video-slide',
            prevBtnSelector: '.prev-btn',
            nextBtnSelector: '.next-btn',
            indicatorsContainerSelector: '.custom-indicators',
            slidesContainerSelector: '.video-slider',
            visibleCountLogic: () => window.innerWidth < 768 ? 1 : 2
        });

        setupCarousel({
            sectionSelector: '.certificate-section',
            itemSelector: '.certificate-slide',
            prevBtnSelector: '.carousel-control-prev',
            nextBtnSelector: '.carousel-control-next',
            indicatorsContainerSelector: '.custom-indicators',
            slidesContainerSelector: '.carousel-inner .row',
            visibleCountLogic: () => {
                const width = window.innerWidth;
                return width < 768 ? 1 : width < 992 ? 2 : 3;
            }
        });

        setupCarousel({
            sectionSelector: '.promotions-section',
            itemSelector: '.promotion-card',
            prevBtnSelector: '.carousel-control.prev',
            nextBtnSelector: '.carousel-control.next',
            indicatorsContainerSelector: '.custom-indicators',
            slidesContainerSelector: '.carousel-inner .row',
            visibleCountLogic: () => {
                const width = window.innerWidth;
                return width < 768 ? 1 : width < 992 ? 2 : 3;
            }
        });

        setupCarousel({
            sectionSelector: '.installers-section',
            itemSelector: '.installer-card',
            prevBtnSelector: '.carousel-control-prev',
            nextBtnSelector: '.carousel-control-next',
            indicatorsContainerSelector: '.carousel-indicators-container .carousel-indicators',
            slidesContainerSelector: '.carousel-inner .row',
            visibleCountLogic: () => {
                const width = window.innerWidth;
                return width < 768 ? 1 : width < 992 ? 2 : 4;
            }
        });

        const style = document.createElement('style');
        style.textContent = `
            .reviews-slider, .video-slider, .carousel-inner .row {
                cursor: grab;
                user-select: none;
                touch-action: pan-y;
                display: flex;
                width: 100%;
            }
            .review-slide, .video-slide, .promotion-card, .installer-card, .certificate-slide {
                flex: 0 0 calc(100% / var(--visible-count, 3));
                min-width: 0;
                padding: 0 10px;
                box-sizing: border-box;
            }
            .reviews-slider:active, .video-slider:active, .carousel-inner .row:active {
                cursor: grabbing;
            }
            .custom-indicators {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-top: 20px;
            }
            .custom-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: #ccc;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .custom-indicator.active {
                background: var(--primary-color-dark);
            }
            .carousel-btn:disabled, .carousel-control:disabled, .carousel-control-prev:disabled, .carousel-control-next:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            @media (max-width: 767px) {
                .review-slide, .video-slide, .promotion-card, .installer-card, .certificate-slide {
                    flex: 0 0 100% !important;
                }
            }
            @media (min-width: 768px) {
                .review-slide {
                    flex: 0 0 calc(100% / 3) !important;
                }
                .video-slide {
                    flex: 0 0 50% !important;
                }
                .promotion-card {
                    flex: 0 0 calc(100% / 3) !important;
                }
                .installer-card {
                    flex: 0 0 calc(100% / 4) !important;
                }
                .certificate-slide {
                    flex: 0 0 calc(100% / 3) !important;
                }
            }
            @media (max-width: 991px) and (min-width: 768px) {
                .promotion-card, .installer-card, .certificate-slide {
                    flex: 0 0 50% !important;
                }
            }
        `;
        document.head.appendChild(style);
    };

    const setupInfiniteLogoCarousel = () => {
        const logosContainer = document.getElementById('partnersContainer');
        const logosRow = logosContainer.querySelector('.logos-row');
        const logoCards = logosContainer.querySelectorAll('.logo-card');
        if (!logosContainer || !logosRow || logoCards.length === 0) return;

        Array.from(logoCards).forEach(logo => logosRow.appendChild(logo.cloneNode(true)));

        let animationSpeed = window.innerWidth < 768 ? 0.5 : 1;
        let isPaused = false;
        let isDragging = false;
        let startX;
        let startScrollLeft;
        let animationId;

        const animateLogos = () => {
            if (isPaused) return;
            logosContainer.scrollLeft += animationSpeed;
            if (logosContainer.scrollLeft >= logosRow.scrollWidth / 2) {
                logosContainer.scrollLeft = 0;
            }
            animationId = requestAnimationFrame(animateLogos);
        };

        const startAnimation = () => {
            if (!animationId) animationId = requestAnimationFrame(animateLogos);
        };

        const stopAnimation = () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };

        logosContainer.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAnimation();
            logosContainer.style.cursor = 'grab';
        });

        logosContainer.addEventListener('mouseleave', () => {
            isPaused = false;
            startAnimation();
            logosContainer.style.cursor = 'grab';
        });

        logosContainer.addEventListener('mousedown', event => {
            isDragging = true;
            startX = event.pageX - logosContainer.offsetLeft;
            startScrollLeft = logosContainer.scrollLeft;
            logosContainer.style.cursor = 'grabbing';
            stopAnimation();
        });

        logosContainer.addEventListener('mouseup', () => {
            isDragging = false;
            logosContainer.style.cursor = 'grab';
            startAnimation();
        });

        logosContainer.addEventListener('mousemove', event => {
            if (!isDragging) return;
            event.preventDefault();
            const x = event.pageX - logosContainer.offsetLeft;
            logosContainer.scrollLeft = startScrollLeft - (x - startX) * 2;
        });

        logosContainer.addEventListener('touchstart', event => {
            isDragging = true;
            startX = event.touches[0].pageX - logosContainer.offsetLeft;
            startScrollLeft = logosContainer.scrollLeft;
            stopAnimation();
        }, { passive: true });

        logosContainer.addEventListener('touchend', () => {
            isDragging = false;
            startAnimation();
        });

        logosContainer.addEventListener('touchmove', event => {
            if (!isDragging) return;
            const x = event.touches[0].pageX - logosContainer.offsetLeft;
            logosContainer.scrollLeft = startScrollLeft - (x - startX) * 2;
        }, { passive: true });

        window.addEventListener('resize', () => {
            animationSpeed = window.innerWidth < 768 ? 0.5 : 1;
        });

        const style = document.createElement('style');
        style.textContent = `
            .logos-container {
                overflow: hidden;
                width: 100%;
                position: relative;
                cursor: grab;
            }
            .logos-row {
                display: flex;
                width: max-content;
            }
            .logo-card {
                flex: 0 0 auto;
                padding: 15px 25px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .logo-image {
                max-width: 120px;
                max-height: 60px;
                width: auto;
                height: auto;
                object-fit: contain;
                filter: grayscale(100%);
                opacity: 0.7;
                transition: all 0.3s ease;
                pointer-events: none;
            }
            .logo-image:hover {
                filter: grayscale(0%);
                opacity: 1;
            }
            .logos-container:active {
                cursor: grabbing;
            }
            @media (max-width: 768px) {
                .logo-card {
                    padding: 10px 15px;
                }
                .logo-image {
                    max-width: 100px;
                    max-height: 50px;
                }
            }
            @media (max-width: 480px) {
                .logo-card {
                    padding: 8px 12px;
                }
                .logo-image {
                    max-width: 80px;
                    max-height: 40px;
                }
            }
            .logos-container::-webkit-scrollbar {
                display: none;
            }
            .logos-container {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `;
        document.head.appendChild(style);

        startAnimation();
    };

    const setupSimpleLogoCarousel = () => {
        const logosSection = document.querySelector('.logos-section');
        if (!logosSection) return;

        const logosRow = logosSection.querySelector('.row');
        const logos = logosSection.querySelectorAll('.logo-card');
        if (!logosRow || logos.length === 0) return;

        let currentIndex = 0;
        let visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 4;
        const autoScrollInterval = 3000;

        const updateVisibleCount = () => {
            visibleCount = window.innerWidth < 768 ? 1 : window.innerWidth < 992 ? 2 : 4;
            showLogos(currentIndex);
        };

        const showLogos = n => {
            currentIndex = n >= logos.length - visibleCount ? 0 : Math.max(0, n);
            logosRow.style.transform = `translateX(-${currentIndex * (100 / visibleCount)}%)`;
        };

        const autoScroll = () => {
            currentIndex++;
            if (currentIndex >= logos.length - visibleCount + 1) currentIndex = 0;
            showLogos(currentIndex);
        };

        let autoScrollTimer = setInterval(autoScroll, autoScrollInterval);

        window.addEventListener('resize', () => {
            clearInterval(autoScrollTimer);
            updateVisibleCount();
            autoScrollTimer = setInterval(autoScroll, autoScrollInterval);
        });

        updateVisibleCount();
    };

    const setupQuiz = () => {
        const questions = [
            {
                question: "Какой тип дома вас интересует?",
                options: [
                    { text: "Каркасный дом", value: 500000 },
                    { text: "Дом из бруса", value: 750000 },
                    { text: "Кирпичный дом", value: 1000000 },
                    { text: "Газобетонный дом", value: 900000 }
                ],
                note: "Выбор материала влияет на стоимость, долговечность и теплопроводность дома."
            },
            {
                question: "Какая площадь дома вам нужна?",
                options: [
                    { text: "До 50 м²", value: 300000 },
                    { text: "50-80 м²", value: 450000 },
                    { text: "80-120 м²", value: 600000 },
                    { text: "Более 120 м²", value: 800000 }
                ],
                note: "Чем больше площадь, тем выше стоимость строительства и материалов."
            },
            {
                question: "Сколько этажей планируете?",
                options: [
                    { text: "Один этаж", value: 400000 },
                    { text: "Два этажа", value: 600000 },
                    { text: "Два этажа с мансардой", value: 550000 }
                ],
                note: "Двухэтажные дома требуют дополнительных расчетов и укреплений."
            },
            {
                question: "Какой тип фундамента предпочитаете?",
                options: [
                    { text: "Ленточный", value: 250000 },
                    { text: "Свайный", value: 200000 },
                    { text: "Плитный", value: 300000 },
                    { text: "Столбчатый", value: 150000 }
                ],
                note: "Тип фундамента зависит от грунта и веса будущего дома."
            },
            {
                question: "Какой тип кровли вам нужен?",
                options: [
                    { text: "Металлочерепица", value: 150000 },
                    { text: "Мягкая кровля", value: 200000 },
                    { text: "Профнастил", value: 120000 },
                    { text: "Натуральная черепица", value: 250000 }
                ],
                note: "Кровля влияет на внешний вид дома и его долговечность."
            },
            {
                question: "Нужна ли внутренняя отделка?",
                options: [
                    { text: "Черновая отделка", value: 200000 },
                    { text: "Под чистовую", value: 350000 },
                    { text: "Полная отделка под ключ", value: 500000 }
                ],
                note: "Полная отделка включает все работы по внутреннему обустройству дома."
            },
            {
                question: "Дополнительные опции",
                options: [
                    { text: "Терраса или веранда", value: 100000 },
                    { text: "Балкон", value: 50000 },
                    { text: "Гараж", value: 200000 },
                    { text: "Без дополнительных опций", value: 0 }
                ],
                note: "Дополнительные элементы увеличивают стоимость, но добавляют комфорта."
            }
        ];

        const quizContainer = document.getElementById('quiz-questions');
        const nextBtn = document.getElementById('next-btn');
        const backBtn = document.getElementById('back-btn');
        const progressBar = document.querySelector('.progress-bar');
        const currentQuestionElement = document.getElementById('current-question');
        const quizResult = document.getElementById('quiz-result');
        const calculatedPrice = document.getElementById('calculated-price');
        let currentQuestion = 0;
        let totalPrice = 0;
        let userAnswers = [];

        const showQuestion = index => {
            const question = questions[index];
            progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
            currentQuestionElement.textContent = index + 1;

            let questionHTML = `
                <div class="quiz-question card-title">${question.question}</div>
                <div class="quiz-options">
            `;
            question.options.forEach((option, i) => {
                const isChecked = userAnswers[index] && userAnswers[index].text === option.text ? 'checked' : '';
                questionHTML += `
                    <div class="quiz-option">
                        <input type="radio" name="answer" id="option-${i}" value="${option.value}" class="quiz-input" ${isChecked}>
                        <label for="option-${i}" class="quiz-label">${option.text}</label>
                    </div>
                `;
            });
            if (question.note) {
                questionHTML += `
                    <div class="quiz-note">
                        <p>${question.note}</p>
                    </div>
                `;
            }
            quizContainer.innerHTML = questionHTML;

            backBtn.disabled = index === 0;
            backBtn.classList.toggle('disabled', index === 0);
            nextBtn.disabled = !userAnswers[index];

            quizContainer.querySelectorAll('.quiz-input').forEach(option => {
                option.addEventListener('change', () => {
                    nextBtn.disabled = false;
                    quizContainer.querySelectorAll('.quiz-label').forEach(label => label.classList.remove('selected'));
                    option.nextElementSibling.classList.add('selected');
                });
            });
        };

        nextBtn.addEventListener('click', () => {
            const selectedOption = quizContainer.querySelector('input[name="answer"]:checked');
            if (!selectedOption) return;

            const selectedText = selectedOption.nextElementSibling.textContent;
            const selectedValue = parseInt(selectedOption.value);

            if (!userAnswers[currentQuestion]) {
                totalPrice += selectedValue;
            } else {
                totalPrice = totalPrice - userAnswers[currentQuestion].value + selectedValue;
            }

            userAnswers[currentQuestion] = { text: selectedText, value: selectedValue };
            currentQuestion++;

            if (currentQuestion < questions.length) {
                showQuestion(currentQuestion);
            } else {
                quizContainer.style.display = 'none';
                nextBtn.style.display = 'none';
                backBtn.style.display = 'none';
                document.querySelector('.quiz-progress').style.display = 'none';
                quizResult.style.display = 'block';
                calculatedPrice.textContent = totalPrice.toLocaleString('ru-RU');
            }
        });

        backBtn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion(currentQuestion);
            }
        });

        showQuestion(0);
    };

    const setupTagFilter = () => {
        const tagItems = document.querySelectorAll('.tag-item');
        tagItems.forEach(item => {
            item.addEventListener('click', () => {
                tagItems.forEach(tag => tag.classList.remove('active'));
                item.classList.add('active');
            });
        });
    };

    const setupColorSelector = () => {
        const imageMap = {
            'вишня': {
                'серебро': './img/lamination/1.png',
                'золото': './img/lamination/2.png',
                'бронза': './img/lamination/3.png',
                'титан': './img/lamination/4.png',
                'белое золото': './img/lamination/5.png',
                'медь': './img/lamination/6.png'
            },
            'дуб': {
                'серебро': './img/lamination/7.png',
                'золото': './img/lamination/8.png',
                'бронза': './img/lamination/9.png',
                'титан': './img/lamination/10.png',
                'белое золото': './img/lamination/11.png',
                'медь': './img/lamination/12.png'
            },
            'каштан': {
                'серебро': './img/lamination/13.png',
                'золото': './img/lamination/14.png',
                'бронза': './img/lamination/15.png',
                'титан': './img/lamination/16.png',
                'белое золото': './img/lamination/17.png',
                'медь': './img/lamination/18.png'
            },
            'сосна': {
                'серебро': './img/lamination/19.png',
                'золото': './img/lamination/20.png',
                'бронза': './img/lamination/21.png',
                'титан': './img/lamination/22.png',
                'белое золото': './img/lamination/23.png',
                'медь': './img/lamination/24.png'
            },
            'ольха': {
                'серебро': './img/lamination/25.png',
                'золото': './img/lamination/26.png',
                'бронза': './img/lamination/27.png',
                'титан': './img/lamination/28.png',
                'белое золото': './img/lamination/29.png',
                'медь': './img/lamination/30.png'
            },
            'клен': {
                'серебро': './img/lamination/31.png',
                'золото': './img/lamination/32.png',
                'бронза': './img/lamination/33.png',
                'титан': './img/lamination/34.png',
                'белое золото': './img/lamination/35.png',
                'медь': './img/lamination/36.png'
            }
        };

        const frameColorOptions = document.querySelectorAll('.frame-colors .color-option');
        const hardwareColorOptions = document.querySelectorAll('.hardware-colors .color-option');
        const windowImage = document.getElementById('windowImage');
        const selectionResult = document.getElementById('selectionResult');

        const updatePreview = () => {
            const selectedFrame = document.querySelector('.frame-colors .color-option.active');
            const selectedHardware = document.querySelector('.hardware-colors .color-option.active');
            const frameName = selectedFrame.getAttribute('data-color');
            const hardwareName = selectedHardware.getAttribute('data-color');

            windowImage.classList.add('image-loading');
            const imagePath = imageMap[frameName]?.[hardwareName] || 'https://placehold.co/600x400/ff0000/FFFFFF/png?text=Изображение+не+найдено';

            const newImage = new Image();
            newImage.onload = () => {
                windowImage.src = imagePath;
                windowImage.alt = `Окно с рамой ${frameName} и фурнитурой ${hardwareName}`;
                windowImage.classList.remove('image-loading');
            };
            newImage.onerror = () => {
                windowImage.src = 'https://placehold.co/600x400/ff0000/FFFFFF/png?text=Ошибка+загрузки';
                windowImage.alt = 'Ошибка загрузки изображения';
                windowImage.classList.remove('image-loading');
            };
            newImage.src = imagePath;

            selectionResult.textContent = `Выбрана рама: ${frameName.charAt(0).toUpperCase() + frameName.slice(1)}, фурнитура: ${hardwareName.charAt(0).toUpperCase() + hardwareName.slice(1)}`;
        };

        frameColorOptions.forEach(option => {
            option.addEventListener('click', () => {
                frameColorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                updatePreview();
            });
        });

        hardwareColorOptions.forEach(option => {
            option.addEventListener('click', () => {
                hardwareColorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                updatePreview();
            });
        });

        updatePreview();
    };

    setupNavigation();
    setupMobileMenu();
    setupWindowEvents();
    setupLightbox();
    setupCertificateModal();
    setupVideoModal();
    setupCalculator();
    setupProjectFilter();
    setupAccordion();
    setupCarousels();
    setupInfiniteLogoCarousel();
    setupSimpleLogoCarousel();
    setupQuiz();
    setupTagFilter();
    setupColorSelector();
});