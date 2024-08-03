document.addEventListener('DOMContentLoaded', () => {
    // Navigation Buttons
    const navButtons = document.querySelectorAll(".navbar-menu button");
    const contentSections = document.querySelectorAll(".content");

    const setActiveContent = (contentId) => {
        // Fade out all content sections
        contentSections.forEach(section => {
            section.style.opacity = '0';
            setTimeout(() => {
                section.classList.remove('active');
                // If this is the target section, fade it in
                if (section.id === contentId) {
                    section.classList.add('active');
                    setTimeout(() => {
                        section.style.opacity = '1';
                    }, 50);
                }
            }, 300);
        });
    };

    const setActiveNavButton = (button) => {
        // Remove active class from all buttons
        navButtons.forEach(btn => btn.classList.remove("active"));
        // Add active class to the clicked button
        button.classList.add("active");
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const contentId = button.getAttribute('data-content');
            setActiveContent(contentId);
            setActiveNavButton(button);
        });
    });

    // Set Pricing as active by default
    const pricingButton = document.querySelector('.navbar-menu button[data-content="pricing"]');
    setActiveNavButton(pricingButton);
    setActiveContent('pricing');
    

    // Project and Customer Toggles
    const projectToggleContainer = document.querySelector('.project-toggle-group');
    const customerToggleContainer = document.querySelector('.customer-toggle-group');
    const projectToggleButtons = document.querySelectorAll('.project-toggle-group .toggle-btn');
    const customerToggleButtons = document.querySelectorAll('.customer-toggle-group .toggle-btn-2');
    const toggleSections = document.querySelectorAll('.section');
    
    function updateToggleIndicator(container, activeButton) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        const offset = buttonRect.left - containerRect.left;
        const width = buttonRect.width;
        
        container.style.setProperty('--indicator-left', `${offset}px`);
        container.style.setProperty('--indicator-width', `${width}px`);
    }
    
    function handleProjectToggle(button) {
        if (!canClick()) return;
        
        projectToggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updateToggleIndicator(projectToggleContainer, button);
        
    
        const target = button.getAttribute('data-target');
        const targetSection = document.getElementById(target);
    
        toggleSections.forEach(section => {
            if (section !== targetSection) {
                section.style.opacity = '0';
                section.style.visibility = 'hidden';
                setTimeout(() => {
                    section.classList.remove('active');
                    section.style.position = 'absolute';
                }, 300);
            }
        });
    
        setTimeout(() => {
            targetSection.style.position = 'relative';
            targetSection.classList.add('active');
            setTimeout(() => {
                targetSection.style.opacity = '1';
                targetSection.style.visibility = 'visible';
            }, 50);
        }, 300);
    }
    
    function handleCustomerToggle(button) {
        if (!canClick()) return;
        customerToggleButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updateToggleIndicator(customerToggleContainer, button);
    
        const customerType = button.getAttribute('data-target');
        updatePrices(customerType);
    }
    
        // Function to get the active button's data-target
    function getActiveTarget(groupClass) {
        const activeButton = document.querySelector(`.${groupClass} .active`);
        return activeButton ? activeButton.getAttribute('data-target') : null;
    }

    // Function to update prices based on customer type and project category
    function updatePrices() {
        const customerType = getActiveTarget('customer-toggle-group');
        const projectCategory = getActiveTarget('project-toggle-group');
        
        const priceElements = document.querySelectorAll('.price');
        priceElements.forEach(priceElement => {
            const basePrice = parseFloat(priceElement.getAttribute('data-base-price'));
            let multiplier = 1;

            // Determine the multiplier based on customer type
            switch(customerType) {
                case 'commercial':
                    switch(projectCategory) {
                        case 'graphics':
                            multiplier = 3; // 80% discount for Graphics
                            break;
                        case 'ux':
                            multiplier = 2; // 70% discount for UX
                            break;
                        case 'website':
                            multiplier = 2; // 60% discount for Website
                            break;
                        default:
                            multiplier = 1; // Default 70% discount if no project category is selected
                    }
                    break;
                    break;
                case 'standard':
                    switch(projectCategory) {
                        case 'graphics':
                            multiplier = 1; // 80% discount for Graphics
                            break;
                        case 'ux':
                            multiplier = 1; // 70% discount for UX
                            break;
                        case 'website':
                            multiplier = 1; // 60% discount for Website
                            break;
                        default:
                            multiplier = 1; // Default 70% discount if no project category is selected
                    }
                    break;
                    break;
                case 'promo':
                    switch(projectCategory) {
                        case 'graphics':
                            multiplier = 0.3; // 80% discount for Graphics
                            break;
                        case 'ux':
                            multiplier = 1; // 70% discount for UX
                            break;
                        case 'website':
                            multiplier = 0.4; // 60% discount for Website
                            break;
                        default:
                            multiplier = 1; // Default 70% discount if no project category is selected
                    }
                    break;
                default:
                    multiplier = 1; // Default to normal price
            }

            const newPrice = (basePrice * multiplier).toFixed(2);
            const newPriceDigits = newPrice.split('');

            // Create a container for the new price
            const tempContainer = document.createElement('span');

            newPriceDigits.forEach((digit, index) => {
                const digitElement = document.createElement('span');
                digitElement.className = 'digit';
                digitElement.textContent = digit;
                digitElement.style.animationDelay = `${index * 0.05}s`;
                tempContainer.appendChild(digitElement);
            });

            // Add the currency and price detail elements
            const currencyElement = document.createElement('span');
            currencyElement.textContent = 'PHP ';
            tempContainer.insertBefore(currencyElement, tempContainer.firstChild);

            const priceDetailElement = document.createElement('span');
            priceDetailElement.className = 'price-detail';
            priceDetailElement.textContent = priceElement.querySelector('.price-detail').textContent;
            tempContainer.appendChild(priceDetailElement);

            // Replace the old price with the new animated price
            priceElement.innerHTML = '';
            priceElement.appendChild(tempContainer);
        });
    }

// Add event listeners to toggle buttons to update prices when clicked
document.querySelectorAll('.toggle-btn, .toggle-btn-2').forEach(button => {
    button.addEventListener('click', (event) => {
        // Remove 'active' class from all buttons in the same group
        const groupClass = event.target.classList.contains('toggle-btn') ? 'toggle-btn' : 'toggle-btn-2';
        document.querySelectorAll(`.${groupClass}`).forEach(btn => btn.classList.remove('active'));

        // Add 'active' class to the clicked button
        event.target.classList.add('active');

        // Update prices based on the selected buttons
        updatePrices();
    });
});

    
    
    
    projectToggleButtons.forEach(button => {
        button.addEventListener('click', (event) => handleProjectToggle(button, event));
    });
    
    customerToggleButtons.forEach(button => {
        button.addEventListener('click', (event) => handleCustomerToggle(button, event));
    });
    
    // Initialize the toggle indicators
    updateToggleIndicator(projectToggleContainer, document.querySelector('.project-toggle-group .toggle-btn.active'));
    updateToggleIndicator(customerToggleContainer, document.querySelector('.customer-toggle-group .toggle-btn-2.active'));
    
    // Set initial base prices
    document.querySelectorAll('.price').forEach(priceElement => {
        const currentPrice = parseFloat(priceElement.textContent.replace('PHP ', '').split(' ')[0]);
        priceElement.setAttribute('data-base-price', currentPrice);
    });

    let lastClickTime = 0;
    const cooldownDuration = 500; // 500 milliseconds (0.5 seconds)

    function canClick() {
        const currentTime = Date.now();
        if (currentTime - lastClickTime >= cooldownDuration) {
            lastClickTime = currentTime;
            return true;
        }
        return false;
    }
// Accordion Functionality
const accordionItems = document.querySelectorAll('.accordion-item');
let activeAccordion = null;
let timer = null;
const timerDuration = 30000; // 30 seconds
const updateInterval = 16; // Update every 16ms for smooth animation (approximately 60fps)

function resetTimer() {
    if (timer) clearInterval(timer);
    if (activeAccordion) {
        const timerBar = activeAccordion.querySelector('.timer-bar');
        timerBar.style.width = '0%';
    }
}

function startTimer(accordion) {
    resetTimer();
    const timerBar = accordion.querySelector('.timer-bar');
    let startTime = Date.now();
    
    timer = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        let progress = (elapsedTime / timerDuration) * 100;
        
        if (progress >= 100) {
            clearInterval(timer);
            closeAccordion(accordion);
            openNextAccordion(accordion);
        } else {
            timerBar.style.width = progress + '%';
        }
    }, updateInterval);
}

function closeAccordion(accordion) {
    const content = accordion.querySelector('.accordion-content');
    content.style.maxHeight = null;
    accordion.querySelector('.accordion-header').classList.remove('active');
    resetTimer();
}

function openAccordion(accordion) {
    if (activeAccordion) closeAccordion(activeAccordion);
    const content = accordion.querySelector('.accordion-content');
    content.style.maxHeight = content.scrollHeight + 'px';
    accordion.querySelector('.accordion-header').classList.add('active');
    activeAccordion = accordion;
    startTimer(accordion);
}

function openNextAccordion(currentAccordion) {
    const nextAccordion = currentAccordion.nextElementSibling || accordionItems[0];
    openAccordion(nextAccordion);
}

function handleAccordionClosure(item) {
    closeAccordion(item);
    activeAccordion = null;
    
    setTimeout(() => {
        if (!activeAccordion) {
            openNextAccordion(item);
        }
    }, 3000); // 3 seconds delay
}

accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        if (activeAccordion === item) {
            handleAccordionClosure(item);
        } else {
            openAccordion(item);
        }
    });
});

// Open the first accordion by default
openAccordion(accordionItems[0]);


    function textEffect(element, texts) {
        let currentTextIndex = 0;
        let currentText = '';
        let isDeleting = false;
        let typingSpeed = 100;
        let pauseDuration = 2000;
    
        function type() {
            const fullText = texts[currentTextIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, currentText.length - 1);
            } else {
                currentText = fullText.substring(0, currentText.length + 1);
            }
            
            element.innerHTML = currentText;
            
            let typeSpeed = typingSpeed;
    
            if (isDeleting) {
                typeSpeed /= 2;
            }
            
            if (!isDeleting && currentText === fullText) {
                typeSpeed = pauseDuration;
                isDeleting = true;
            } else if (isDeleting && currentText === '') {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        type();
    }
    
    // Start the effect when the page loads
    window.onload = function() {
        const element = document.getElementById('location');
        const texts = [
            'Manila, Philippines',
            '14.5995° N, 120.9842° E'
        ];
        textEffect(element, texts);
    };



    const header = document.getElementById('yue-memoir');
    const originalText = header.textContent;
    const newText = 'Johncen Jekk Tesnado';
    let typingTimeout;
    let isOriginalText = true;
    
    header.addEventListener('click', () => {
        clearTimeout(typingTimeout);
        header.classList.add('typing-animation');
        if (isOriginalText) {
        backspaceText(header, originalText.length, () => {
            setTimeout(() => typeText(header, newText, () => {
            header.classList.remove('typing-animation');
            }), 100); // Slight delay before typing new text
        });
        } else {
        backspaceText(header, newText.length, () => {
            setTimeout(() => typeText(header, originalText, () => {
            header.classList.remove('typing-animation');
            }), 100); // Slight delay before typing original text
        });
        }
        isOriginalText = !isOriginalText;
    });
    
    function typeText(element, text, callback, index = 0) {
        if (index < text.length) {
        element.textContent = text.substring(0, index + 1);
        typingTimeout = setTimeout(() => typeText(element, text, callback, index + 1), 100); // Consistent typing speed
        } else {
        if (callback) callback();
        }
    }
    
    function backspaceText(element, index, callback) {
        if (index > 0) {
        element.textContent = element.textContent.substring(0, index - 1);
        typingTimeout = setTimeout(() => backspaceText(element, index - 1, callback), 50); // Consistent backspacing speed
        } else {
        callback();
        }
    }

    // Prevent double-tap zoom on mobile browsers
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);


    const text = document.getElementById('textEffect');
    const textRect = text.getBoundingClientRect();
});    


