document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileMenuToggle.classList.toggle('active');
            
            // Animate hamburger bars to 'X'
            const bars = mobileMenuToggle.querySelectorAll('.bar');
            if (mobileMenuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileMenuToggle.classList.remove('active');
                const bars = mobileMenuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // --- Header Scrolled Effect ---
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page loads scrolled

    // --- Active Nav Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Stats Counter Animation ---
    const stats = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const count = +stat.innerText.replace('+', '').replace('%', '').replace(' LPA', '');
            
            // Format suffix logic
            let suffix = '';
            if (stat.getAttribute('data-target') === '5000') suffix = '+';
            if (stat.getAttribute('data-target') === '95') suffix = '%';
            if (stat.getAttribute('data-target') === '150') suffix = '+';
            if (stat.getAttribute('data-target') === '12') suffix = ' LPA';
            
            const speed = 100; // lower is faster
            const increment = target / speed;
            
            const updateCount = () => {
                const currentVal = +stat.innerText.replace('+', '').replace('%', '').replace(' LPA', '');
                if (currentVal < target) {
                    const newVal = Math.ceil(currentVal + increment);
                    stat.innerText = newVal > target ? target + suffix : newVal + suffix;
                    setTimeout(updateCount, 15);
                } else {
                    stat.innerText = target + suffix;
                }
            };
            
            updateCount();
        });
    };

    // Trigger stats animation when visible
    const statsBar = document.querySelector('.stats-bar-wrapper');
    if (statsBar) {
        const observerOptions = {
            root: null,
            threshold: 0.1
        };
        
        let animated = false;
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animateStats();
                    animated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        observer.observe(statsBar);
    }

    // --- Course Selection Trigger ---
    const enquiryTriggers = document.querySelectorAll('.enquiry-trigger');
    const courseSelect = document.getElementById('form-course');

    enquiryTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const courseVal = trigger.getAttribute('data-course');
            if (courseSelect && courseVal) {
                courseSelect.value = courseVal;
            }
        });
    });

    // --- Contact Form Submission Handling ---
    const form = document.getElementById('career-enquiry-form');
    const statusMessage = document.getElementById('form-status-message');
    const submitBtn = document.getElementById('form-submit-btn');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            
            // Get form inputs
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const phone = document.getElementById('form-phone').value;
            const course = document.getElementById('form-course').value;
            const message = document.getElementById('form-message').value;

            // Simulate form submission to backend/firebase database
            setTimeout(() => {
                // Success simulation
                statusMessage.innerText = `Thank you, ${name}! Your request for ${course || 'Career Counselling'} has been received. Our team will contact you shortly on ${phone}.`;
                statusMessage.className = 'form-status success';
                
                // Clear form
                form.reset();
                
                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Scroll status message into view
                statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

                // Hide message after 8 seconds
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 8000);
            }, 1500);
        });
    }

    // --- Smooth Scroll Offset Fix for Hash Anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
