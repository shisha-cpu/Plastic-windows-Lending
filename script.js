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
    const mobileAccordion = document.querySelector('#mobileMenuAccordion');
    if (mobileAccordion.children.length === 0) {
        topNavItems.forEach((item, index) => {
            const link = item.querySelector('.nav-link');
            const dropdownMenu = item.querySelector('.dropdown-menu');
            if (link && dropdownMenu) {
                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';
                accordionItem.innerHTML = `
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#mobile-top-${index}" aria-expanded="false">
                            ${link.textContent}
                        </button>
                    </h2>
                    <div id="mobile-top-${index}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            ${dropdownMenu.innerHTML}
                        </div>
                    </div>
                `;
                mobileAccordion.appendChild(accordionItem);
            }
        });

        navItems.forEach((item, index) => {
            if (item === navItems[navItems.length - 1]) return;
            const link = item.querySelector('.bottom-nav-link');
            const megaMenu = item.querySelector('.mega-menu');
            if (link && megaMenu) {
                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';
                accordionItem.innerHTML = `
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#mobile-bottom-${index}" aria-expanded="false">
                            ${link.textContent.replace(/<span.*<\/span>/, '')}
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
    }

    burgerMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
    });

    mobileOverlay.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
    });

    // Add event listener for the close button
    const closeButton = document.querySelector('.mobile-menu-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });
    }
};

    const setupWindowEvents = () => {
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
        const lightboxContent = document.querySelector('.lightbox-content');
        const photoItems = document.querySelectorAll('.photo-item');
        
        const prevButton = document.createElement('button');
        const nextButton = document.createElement('button');
        
        prevButton.className = 'modal-nav modal-prev';
        prevButton.innerHTML = '&#10094;';
        nextButton.className = 'modal-nav modal-next';
        nextButton.innerHTML = '&#10095;';
        
        lightboxContent.appendChild(prevButton);
        lightboxContent.appendChild(nextButton);
        
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
            updateNavigationButtons();
        };

        const updateNavigationButtons = () => {
            prevButton.style.display = imageData.length > 1 ? 'block' : 'none';
            nextButton.style.display = imageData.length > 1 ? 'block' : 'none';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            window.scrollTo(0, scrollPosition);
        };

        const showNextImage = () => {
            currentIndex = (currentIndex + 1) % imageData.length;
            updateLightbox();
        };

        const showPrevImage = () => {
            currentIndex = (currentIndex - 1 + imageData.length) % imageData.length;
            updateLightbox();
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
                showPrevImage();
            } else if (event.key === 'ArrowRight') {
                showNextImage();
            }
        });

        prevButton.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            showPrevImage();
        });

        nextButton.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            showNextImage();
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
        const certificateImages = document.querySelectorAll('.certificate-img');
        
        const prevButton = document.createElement('button');
        const nextButton = document.createElement('button');
        
        prevButton.className = 'modal-nav modal-prev';
        prevButton.innerHTML = '&#10094;';
        nextButton.className = 'modal-nav modal-next';
        nextButton.innerHTML = '&#10095;';
        
        modalContent.appendChild(prevButton);
        modalContent.appendChild(nextButton);
        
        let currentImageIndex = 0;
        let isDragging = false;
        let startX, startY;
        let clickStartTime = 0;

        const openCertificateModal = (imgSrc, imgAlt, index) => {
            if (!certificateModal || !modalImage || isDragging) return;
            currentImageIndex = index;
            modalImage.src = imgSrc;
            modalImage.alt = imgAlt;
            certificateModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            updateNavigationButtons();
        };

        const closeCertificateModal = () => {
            if (!certificateModal) return;
            certificateModal.style.display = 'none';
            document.body.style.overflow = '';
            modalImage.src = '';
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % certificateImages.length;
            updateModalImage();
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + certificateImages.length) % certificateImages.length;
            updateModalImage();
        };

        const updateModalImage = () => {
            const img = certificateImages[currentImageIndex];
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            updateNavigationButtons();
        };

        const updateNavigationButtons = () => {
            prevButton.style.display = certificateImages.length > 1 ? 'block' : 'none';
            nextButton.style.display = certificateImages.length > 1 ? 'block' : 'none';
        };

        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });

        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });

        certificateImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            
            img.addEventListener('mousedown', (e) => {
                isDragging = false;
                startX = e.clientX;
                startY = e.clientY;
                clickStartTime = Date.now();
            });

            img.addEventListener('mousemove', (e) => {
                if (startX !== undefined && startY !== undefined) {
                    const diffX = Math.abs(e.clientX - startX);
                    const diffY = Math.abs(e.clientY - startY);
                    if (diffX > 5 || diffY > 5) {
                        isDragging = true;
                    }
                }
            });

            img.addEventListener('click', (e) => {
                const clickDuration = Date.now() - clickStartTime;
                if (!isDragging && clickDuration < 200) {
                    openCertificateModal(img.src, img.alt, index);
                }
                isDragging = false;
            });

            img.addEventListener('mouseleave', () => {
                isDragging = false;
                startX = undefined;
                startY = undefined;
            });
        });

        modalClose.addEventListener('click', event => {
            event.stopPropagation();
            closeCertificateModal();
        });

        certificateModal.addEventListener('click', event => {
            if (event.target === certificateModal) {
                closeCertificateModal();
            }
        });

        if (modalContent) {
            modalContent.addEventListener('click', event => {
                if (!event.target.closest('.modal-image') && 
                    !event.target.closest('.modal-nav')) {
                    closeCertificateModal();
                }
            });
        }

        document.addEventListener('keydown', event => {
            if (certificateModal.style.display !== 'flex') return;
            if (event.key === 'Escape') {
                closeCertificateModal();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            } else if (event.key === 'ArrowRight') {
                showNextImage();
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

        const openVideoModal = (videoId) => {
            if (!videoId) {
                console.warn('No video ID provided for modal');
                videoWrapper.innerHTML = '<p style="color: white; text-align: center;">Ошибка: Видео недоступно, отсутствует ID.</p>';
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                isModalOpen = true;
                return;
            }

            const iframe = document.createElement('iframe');
            iframe.src = `https://rutube.ru/play/embed/${videoId}?skinColor=000000`;
            iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');
            iframe.setAttribute('allowfullscreen', '');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.onerror = () => {
                console.error(`Failed to load RuTube video with ID: ${videoId}`);
                videoWrapper.innerHTML = '<p style="color: white; text-align: center;">Ошибка загрузки видео. Пожалуйста, попробуйте позже.</p>';
                videoModal.classList.add('active');
                isModalOpen = true;
            };
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

            placeholder.addEventListener('mousedown', (e) => {
                dragStartTime = Date.now();
                isDragging = false;
                e.stopPropagation();
            });

            placeholder.addEventListener('mousemove', (e) => {
                if (Date.now() - dragStartTime > 200) {
                    isDragging = true;
                }
            });

            placeholder.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isDragging) return;
                const videoId = placeholder.getAttribute('data-video-id');
                openVideoModal(videoId);
            });

            placeholder.addEventListener('mouseup', (e) => {
                e.stopPropagation();
            });

            placeholder.addEventListener('touchstart', (e) => {
                dragStartTime = Date.now();
                isDragging = false;
                e.stopPropagation();
            }, { passive: false });

            placeholder.addEventListener('touchmove', (e) => {
                if (Date.now() - dragStartTime > 200) {
                    isDragging = true;
                }
            }, { passive: false });

            placeholder.addEventListener('touchend', (e) => {
                e.stopPropagation();
                if (!isDragging) {
                    const videoId = placeholder.getAttribute('data-video-id');
                    openVideoModal(videoId);
                }
            });
        });

        modalClose?.addEventListener('click', (event) => {
            event.stopPropagation();
            closeVideoModal();
        });

        modalOverlay?.addEventListener('click', closeVideoModal);

        videoModal?.addEventListener('click', (event) => {
            if (event.target === videoModal) closeVideoModal();
        });

        modalContent?.addEventListener('click', (event) => event.stopPropagation());

        document.addEventListener('keydown', (event) => {
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
        document.querySelectorAll('.accordion-collapse').forEach(collapse => {
            collapse.removeAttribute('data-bs-parent');
        });

        const accordionButtons = document.querySelectorAll('.accordion-button');
        accordionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('data-bs-target');
                const targetCollapse = document.querySelector(targetId);
                const collapseInstance = bootstrap.Collapse.getOrCreateInstance(targetCollapse);
                collapseInstance.toggle();
            });
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('data-bs-target');
                const targetCollapse = document.querySelector(targetId);
                const collapseInstance = bootstrap.Collapse.getOrCreateInstance(targetCollapse);
                collapseInstance.toggle();
            });
        });
    };
const setupCarousel = ({ sectionSelector, itemSelector, prevBtnSelector, nextBtnSelector, indicatorsContainerSelector, slidesContainerSelector, visibleCountLogic }) => {
    const section = document.querySelector(sectionSelector);
    if (!section) return;

    const slidesContainer = section.querySelector(slidesContainerSelector);
    const originalItems = section.querySelectorAll(itemSelector);
    if (!slidesContainer || originalItems.length === 0) return;

    const items = Array.from(originalItems);
    const totalOriginalItems = items.length;
    const clonesBefore = items.map(item => item.cloneNode(true));
    const clonesAfter = items.map(item => item.cloneNode(true));
    clonesBefore.forEach(clone => slidesContainer.appendChild(clone));
    items.forEach(item => slidesContainer.appendChild(item));
    clonesAfter.forEach(clone => slidesContainer.appendChild(clone));

    const prevBtn = section.querySelector(prevBtnSelector);
    const nextBtn = section.querySelector(nextBtnSelector);
    const indicatorsContainer = section.querySelector(indicatorsContainerSelector);

    let currentIndex = totalOriginalItems;
    let visibleCount = visibleCountLogic();
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isAnimating = false;
    const threshold = 50;

    const updateVisibleCount = () => {
        const oldVisibleCount = visibleCount;
        visibleCount = visibleCountLogic();
        slidesContainer.style.setProperty('--visible-count', visibleCount);
        if (oldVisibleCount !== visibleCount) {
            currentIndex = totalOriginalItems; // Reset to the first original slide
            slidesContainer.querySelectorAll(itemSelector).forEach(item => {
                item.style.flex = `0 0 ${100 / visibleCount}%`;
            });
            showSlide(currentIndex, false); // Reposition without animation
        }
        createIndicators();
        updateButtonState();
    };

    const createIndicators = () => {
        if (!indicatorsContainer) return;
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalOriginalItems; i++) {
            const indicator = document.createElement('button');
            indicator.className = `custom-indicator${i === (currentIndex % totalOriginalItems) ? ' active' : ''}`;
            indicator.setAttribute('aria-label', `Slide ${i + 1}`);
            indicator.addEventListener('click', () => {
                if (!isAnimating) showSlide(totalOriginalItems + i);
            });
            indicatorsContainer.appendChild(indicator);
        }
    };

    const showSlide = (index, animate = true) => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = index;
        const totalItems = slidesContainer.querySelectorAll(itemSelector).length;
        const slideWidth = 100 / visibleCount;
        let translateX = -(currentIndex * slideWidth);

        // Ensure translateX is within bounds for mobile
        if (visibleCount === 1) {
            translateX = -(currentIndex * 100); // Each slide takes 100% width
        }

        slidesContainer.style.transition = animate ? 'transform 0.5s ease-out' : 'none';
        slidesContainer.style.transform = `translateX(${translateX}%)`;

        // Handle infinite scrolling
        if (currentIndex <= totalOriginalItems - visibleCount) {
            setTimeout(() => {
                currentIndex += totalOriginalItems;
                translateX = -(currentIndex * slideWidth);
                slidesContainer.style.transition = 'none';
                slidesContainer.style.transform = `translateX(${translateX}%)`;
                slidesContainer.offsetHeight; // Force reflow
                isAnimating = false;
                updateButtonState();
            }, animate ? 500 : 0);
        } else if (currentIndex >= totalOriginalItems * 2) {
            setTimeout(() => {
                currentIndex -= totalOriginalItems;
                translateX = -(currentIndex * slideWidth);
                slidesContainer.style.transition = 'none';
                slidesContainer.style.transform = `translateX(${translateX}%)`;
                slidesContainer.offsetHeight; // Force reflow
                isAnimating = false;
                updateButtonState();
            }, animate ? 500 : 0);
        } else {
            setTimeout(() => {
                isAnimating = false;
                updateButtonState();
            }, animate ? 500 : 0);
        }

        prevTranslate = translateX;
        updateIndicators();
    };

    const updateIndicators = () => {
        if (!indicatorsContainer) return;
        const indicators = indicatorsContainer.querySelectorAll('.custom-indicator');
        const activeIndicator = currentIndex % totalOriginalItems;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndicator);
        });
    };

    const updateButtonState = () => {
        if (prevBtn) {
            prevBtn.disabled = isAnimating || totalOriginalItems <= visibleCount;
            prevBtn.style.pointerEvents = isAnimating ? 'none' : 'auto';
        }
        if (nextBtn) {
            nextBtn.disabled = isAnimating || totalOriginalItems <= visibleCount;
            nextBtn.style.pointerEvents = isAnimating ? 'none' : 'auto';
        }
    };

    const startDrag = event => {
        if (isAnimating) return;
        
        // ИСПРАВЛЕНИЕ: Игнорируем drag, если событие начинается на изображении сертификата
        if (event.target.closest('.certificate-img')) {
            return;
        }
        
        if (event.type === 'touchstart') {
            startX = event.touches[0].clientX;
        } else {
            event.preventDefault();
            startX = event.clientX;
        }
        isDragging = true;
        slidesContainer.style.transition = 'none';
    };

    const drag = event => {
        if (!isDragging) return;
        const currentX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
        if (event.type !== 'touchmove') event.preventDefault();
        const deltaX = currentX - startX;
        const containerWidth = slidesContainer.parentElement.offsetWidth;
        currentTranslate = prevTranslate + (deltaX / containerWidth) * 100;
        slidesContainer.style.transform = `translateX(${currentTranslate}%)`;
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        const slideWidth = 100 / visibleCount;
        const dragDistance = prevTranslate - currentTranslate;
        let slidesToMove = Math.round(dragDistance / slideWidth);
        currentIndex += slidesToMove;

        if (currentIndex < totalOriginalItems) {
            currentIndex += totalOriginalItems;
        } else if (currentIndex >= totalOriginalItems * 2) {
            currentIndex -= totalOriginalItems;
        }

        showSlide(currentIndex);
    };

    prevBtn?.addEventListener('click', (event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение
        event.stopPropagation(); // Останавливаем всплытие события
        if (!isAnimating && totalOriginalItems > visibleCount) {
            showSlide(currentIndex - 1);
        }
    });

    nextBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!isAnimating && totalOriginalItems > visibleCount) {
            showSlide(currentIndex + 1);
        }
    });

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

    // Отключаем навигацию, если слайдов меньше или равно visibleCount
    if (totalOriginalItems <= visibleCount) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (indicatorsContainer) indicatorsContainer.style.display = 'none';
    }

    updateVisibleCount();
    showSlide(currentIndex, false);
};
    const setupCarousels = () => {
      setupCarousel({
    sectionSelector: '.reviews-section',
    itemSelector: '.review-slide',
    prevBtnSelector: '.prev-btn',
    nextBtnSelector: '.next-btn',
    indicatorsContainerSelector: '.custom-indicators',
    slidesContainerSelector: '.reviews-slider',

            visibleCountLogic: () => {
                const width = window.innerWidth;
                if (width < 768) return 1;
                if (width < 1100) return 2;
                return 3;
            }
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
                if (width < 768) return 1;
                if (width < 1100) return 2;
                return 3;
            }
        });

        setupCarousel({
            sectionSelector: '.promotions-section',
            itemSelector: '.col-md-4',
            prevBtnSelector: '.carousel-control.prev',
            nextBtnSelector: '.carousel-control.next',
            indicatorsContainerSelector: '.custom-indicators',
            slidesContainerSelector: '.carousel-inner .row',
            visibleCountLogic: () => {
                const width = window.innerWidth;
                if (width < 576) return 1;
                if (width < 768) return 1;
                if (width < 992) return 2;
                return 3;
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
                flex-wrap: nowrap;
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

        const allLogos = logosRow.querySelectorAll('.logo-card');
        if (allLogos.length > logoCards.length) {
            for (let i = logoCards.length; i < allLogos.length; i++) {
                allLogos[i].remove();
            }
        }

        logoCards.forEach(card => {
            const clone = card.cloneNode(true);
            logosRow.appendChild(clone);
        });

        logosRow.style.display = 'flex';
        logosRow.style.flexWrap = 'nowrap';
        logosContainer.style.overflow = 'hidden';
        logosContainer.style.cursor = 'grab';

        let scrollPosition = 0;
        let isDragging = false;
        let startX;
        let startScrollLeft;
        let velocity = 0;
        let lastX;
        let lastTime;
        let animationFrameId;
        const scrollSpeed = 1;

        const updateScroll = (timestamp) => {
            if (!isDragging) {
                scrollPosition += scrollSpeed;
                const totalWidth = logosRow.scrollWidth / 2;
                if (scrollPosition >= totalWidth) {
                    scrollPosition -= totalWidth;
                    logosContainer.scrollLeft = scrollPosition;
                } else {
                    logosContainer.scrollLeft = scrollPosition;
                }
            }
            animationFrameId = requestAnimationFrame(updateScroll);
        };

        const startAutoScroll = () => {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(updateScroll);
        };

        const stopAutoScroll = () => {
            cancelAnimationFrame(animationFrameId);
        };

        const handleDragStart = (clientX) => {
            isDragging = true;
            startX = clientX;
            startScrollLeft = logosContainer.scrollLeft;
            velocity = 0;
            lastX = clientX;
            lastTime = Date.now();
            stopAutoScroll();
            logosContainer.style.cursor = 'grabbing';
            logosContainer.style.scrollBehavior = 'auto';
        };

        const handleDragMove = (clientX) => {
            if (!isDragging) return;
            const x = clientX;
            const walk = x - startX;
            scrollPosition = startScrollLeft - walk;
            logosContainer.scrollLeft = scrollPosition;

            const currentTime = Date.now();
            const deltaX = clientX - lastX;
            const deltaTime = currentTime - lastTime;

            if (deltaTime > 0) {
                velocity = deltaX / deltaTime;
            }

            lastX = clientX;
            lastTime = currentTime;
        };

        const handleDragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            logosContainer.style.cursor = 'grab';
            logosContainer.style.scrollBehavior = 'smooth';

            if (Math.abs(velocity) > 0.1) {
                scrollPosition -= velocity * 100;
                logosContainer.scrollLeft = scrollPosition;
            }

            setTimeout(startAutoScroll, 2000);
        };

        logosContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleDragStart(e.clientX);
        });

        logosContainer.addEventListener('mousemove', (e) => {
            handleDragMove(e.clientX);
        });

        logosContainer.addEventListener('mouseup', handleDragEnd);
        logosContainer.addEventListener('mouseleave', handleDragEnd);

        logosContainer.addEventListener('touchstart', (e) => {
            handleDragStart(e.touches[0].clientX);
        }, { passive: true });

        logosContainer.addEventListener('touchmove', (e) => {
            handleDragMove(e.touches[0].clientX);
        }, { passive: true });

        logosContainer.addEventListener('touchend', handleDragEnd);
        logosContainer.addEventListener('touchcancel', handleDragEnd);

        logosContainer.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        });

        startAutoScroll();
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

        const showResults = () => {
            quizContainer.style.display = 'none';
            nextBtn.style.display = 'none';
            backBtn.style.display = 'none';
            document.querySelector('.quiz-progress').style.display = 'none';
            quizResult.style.display = 'block';
            calculatedPrice.textContent = totalPrice.toLocaleString('ru-RU');

            let answersHTML = '<div class="selected-answers"><h3>Ваши ответы:</h3><ul>';
            userAnswers.forEach((answer, index) => {
                answersHTML += `
                    <li>
                        <strong>Вопрос ${index + 1}: ${questions[index].question}</strong><br>
                        Ответ: ${answer.text}<br>
                        Стоимость: ${answer.value.toLocaleString('ru-RU')} руб.
                    </li>
                `;
            });
            answersHTML += '</ul></div>';

            quizResult.insertAdjacentHTML('beforeend', answersHTML);

            console.log('Результаты квиза:');
            userAnswers.forEach((answer, index) => {
                console.log(`Вопрос ${index + 1}: ${questions[index].question}`);
                console.log(`Ответ: ${answer.text}`);
                console.log(`Стоимость: ${answer.value.toLocaleString('ru-RU')} руб.`);
            });
            console.log(`Итоговая стоимость: ${totalPrice.toLocaleString('ru-RU')} руб.`);
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
                showResults();
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
        const frameColorsMap = {
            'вишня': './img/lamination/cherry.png',
            'дуб': './img/lamination/oak.png',
            'каштан': './img/lamination/chestnut.png',
            'сосна': './img/lamination/pine.png',
            'ольха': './img/lamination/alde.png',
            'клен': './img/lamination/maple.png'
        };

        const hardwareColorsMap = {
            'серебро': './img/lamination/silver.png',
            'золото': './img/lamination/gold.png',
            'бронза': './img/lamination/bronze.png',
            'титан': './img/lamination/titanium.png',
            'белое золото': './img/lamination/white-gold.png',
            'медь': './img/lamination/copper.png'
        };
        const frameColorOptions = document.querySelectorAll('.frame-colors .color-option');
        const hardwareColorOptions = document.querySelectorAll('.hardware-colors .color-option');
        const frameImage = document.getElementById('frameImage');
        const hardwareImage = document.getElementById('hardwareImage');
        const selectionResult = document.getElementById('selectionResult');

        const updatePreview = () => {
            const selectedFrame = document.querySelector('.frame-colors .color-option.active');
            const selectedHardware = document.querySelector('.hardware-colors .color-option.active');
            const frameName = selectedFrame.getAttribute('data-color');
            const hardwareName = selectedHardware.getAttribute('data-color');

            frameImage.classList.add('image-loading');
            const framePath = frameColorsMap[frameName] || './img/cherry.png';
            const frameNewImg = new Image();
            frameNewImg.onload = () => {
                frameImage.src = framePath;
                frameImage.alt = `Рама ${frameName}`;
                frameImage.classList.remove('image-loading');
            };
            frameNewImg.onerror = () => {
                console.error('Ошибка загрузки рамы:', framePath);
                frameImage.classList.remove('image-loading');
            };
            frameNewImg.src = framePath;

            hardwareImage.classList.add('image-loading');
            const hardwarePath = hardwareColorsMap[hardwareName] || './img/silver.png';
            const hardwareNewImg = new Image();
            hardwareNewImg.onload = () => {
                hardwareImage.src = hardwarePath;
                hardwareImage.alt = `Фурнитура ${hardwareName}`;
                hardwareImage.classList.remove('image-loading');
            };
            hardwareNewImg.onerror = () => {
                console.error('Ошибка загрузки фурнитуры:', hardwarePath);
                hardwareImage.classList.remove('image-loading');
            };
            hardwareNewImg.src = hardwarePath;

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