gsap.registerPlugin(ScrollTrigger);

const locoScroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    lerp: 0.05
});

locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy("[data-scroll-container]", {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return { top: 0, 
            left: 0, 
            width: window.innerWidth, 
            height: window.innerHeight 
        };
    },
    pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

function setExpanded(isExpanded) {
    if (hamburger) {
        hamburger.setAttribute('aria-expanded', String(isExpanded));
        hamburger.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
    }
}

if (hamburger && navMenu) {
    const toggleMenu = (isOpening) => {
        hamburger.classList.toggle('active', isOpening);
        navMenu.classList.toggle('active', isOpening);
        document.body.classList.toggle('menu-open', isOpening);
        setExpanded(isOpening);
    };

    hamburger.addEventListener('click', () => {
        const isOpening = !hamburger.classList.contains('active');
        toggleMenu(isOpening);
    });

    const closeMenu = () => toggleMenu(false);

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    locoScroll.scrollTo(targetElement);
                }
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

const contactForm = document.querySelector('.footer__form');
const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
};

const CONFIG = {
    minNameLength: 2,
    maxNameLength: 50,
    maxWords: 500,
    blockedDomains: ['gmal.com', 'gmil.com', 'gail.com', 'gmai.com', 'yaho.com', 'yhoo.com', 'hotmal.com']
};

if (contactForm) {
    Object.values(inputs).forEach(input => {
        if (!input) return;
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-text';
        errorSpan.style.display = 'none';
        input.parentNode.appendChild(errorSpan);

        input.addEventListener('input', () => {
            clearError(input);
            if (input.id === 'message') updateWordCount(input);
        });

        input.addEventListener('blur', () => validateField(input));
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;

        Object.values(inputs).forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Success! Your message has been sent.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
                const wordCountSpan = document.getElementById('word-count');
                if (wordCountSpan) wordCountSpan.innerText = `0 / ${CONFIG.maxWords} words`;
            }, 1500);
        }
    });
}

function validateField(input) {
    const value = input.value.trim();
    let errorMessage = '';

    switch (input.id) {
        case 'name':
            if (value.length === 0) {
                errorMessage = 'Name is required.';
            } else if (value.length < CONFIG.minNameLength) {
                errorMessage = `Name must be at least ${CONFIG.minNameLength} characters.`;
            } else if (/\d/.test(value)) {
                errorMessage = 'Name cannot contain numbers.';
            } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                errorMessage = 'Name contains invalid characters.';
            }
            break;

        case 'email':
            if (value.length === 0) {
                errorMessage = 'Email is required.';
            } else if (!isValidEmailStructure(value)) {
                errorMessage = 'Please enter a valid email address.';
            } else if (isTypoDomain(value)) {
                errorMessage = 'Did you mean @gmail.com or @yahoo.com? Please check typos.';
            }
            break;

        case 'message':
            const wordCount = value === '' ? 0 : value.split(/\s+/).length;
            if (value.length === 0) {
                errorMessage = 'Message cannot be empty.';
            } else if (wordCount > CONFIG.maxWords) {
                errorMessage = `Message exceeds the ${CONFIG.maxWords} word limit.`;
            }
            break;
    }

    if (errorMessage) {
        showError(input, errorMessage);
        return false;
    } else {
        clearError(input);
        return true;
    }
}

function showError(input, message) {
    const parent = input.parentNode;
    const errorSpan = parent.querySelector('.error-text');

    input.classList.add('input-error');
    if (errorSpan) {
        errorSpan.innerText = message;
        errorSpan.style.display = 'block';
    }
}

function clearError(input) {
    const parent = input.parentNode;
    const errorSpan = parent.querySelector('.error-text');

    input.classList.remove('input-error');
    if (errorSpan) {
        errorSpan.style.display = 'none';
    }
}

function isValidEmailStructure(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function isTypoDomain(email) {
    const domain = email.split('@')[1];
    if (!domain) return false;
    return CONFIG.blockedDomains.includes(domain.toLowerCase());
}

function updateWordCount(input) {
    const val = input.value.trim();
    const count = val === '' ? 0 : val.split(/\s+/).length;
}


//gsap 
window.addEventListener("load", () => {

    ScrollTrigger.refresh();

    const tl = gsap.timeline();

    tl.from(".hero__greeting", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out"
    })
        .from(".hero__title", {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.4")
        .from(".hero__desc", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4")
        .from(".hero__actions", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4")
        .from(".hero__stats", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4");

    gsap.utils.toArray(".project-card").forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                scroller: "[data-scroll-container]",
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    gsap.from(".service-item", {
        scrollTrigger: {
            trigger: ".services__list",
            scroller: "[data-scroll-container]",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
    });

    gsap.from(".testimonial-card", {
        scrollTrigger: {
            trigger: ".testimonial-grid",
            scroller: "[data-scroll-container]",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
});

Shery.mouseFollower({
  skew: true,
  ease: "cubic-bezier(0.23, 1, 0.320, 1)",
  duration: 1,
});

Shery.hoverWithMediaCircle(".services__image" , {
  images: ["workspace.jpg"], 
});
