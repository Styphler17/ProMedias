// main.js - Promedias Website Interactions

// Import Motion One via CDN for smooth, high-performance animations
import { animate, scroll, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@10.16.2/+esm";

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Initial Entry Animations ---
    animate(".hero-tag", { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, easing: "ease-out" });
    animate("h1", { opacity: [0, 1], y: [40, 0] }, { duration: 0.8, delay: 0.2, easing: "ease-out" });
    animate(".hero p", { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, delay: 0.3, easing: "ease-out" });
    animate(".hero-btns", { opacity: [0, 1], y: [20, 0] }, { duration: 0.8, delay: 0.4, easing: "ease-out" });
    animate(".hero-img", { opacity: [0, 1], scale: [0.95, 1], rotate: [0, 2] }, { duration: 1, delay: 0.5, easing: "ease-out" });

    // --- On-Scroll Reveal Animations ---
    inView(".trust-card", (info) => {
        animate(info.target, { opacity: [0, 1], y: [50, 0] }, { 
            delay: stagger(0.1),
            duration: 0.6,
            easing: "ease-out"
        });
    });

    inView(".bento-card", (info) => {
        animate(info.target, { opacity: [0, 1], scale: [0.9, 1] }, { 
            delay: stagger(0.1),
            duration: 0.7,
            easing: "ease-out"
        });
    });

    inView(".product-card", (info) => {
        animate(info.target, { opacity: [0, 1], y: [40, 0] }, { 
            delay: stagger(0.1),
            duration: 0.8,
            easing: "ease-out"
        });
    });

    inView(".contact-info", (info) => {
        animate(info.target, { opacity: [0, 1], x: [-50, 0] }, { 
            duration: 1,
            easing: "ease-out"
        });
    });

    inView(".map-container", (info) => {
        animate(info.target, { opacity: [0, 1], scale: [0.95, 1] }, { 
            duration: 1,
            easing: "ease-out"
        });
    });

    inView(".faq-item", (info) => {
        animate(info.target, { opacity: [0, 1], y: [20, 0] }, { 
            delay: stagger(0.1),
            duration: 0.6,
            easing: "ease-out"
        });
    });

    // --- FAQ Accordion Logic ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Navbar Background Change on Scroll ---
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.padding = '10px 0';
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
        } else {
            nav.style.padding = '0';
            nav.style.background = 'rgba(255, 255, 255, 0.8)';
            nav.style.boxShadow = 'none';
        }
    });

    // --- Magnetic Effect for Logo (Micro-interaction) ---
    const logo = document.querySelector('.logo');
    logo.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = logo.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * 0.2;
        const y = (clientY - (top + height / 2)) * 0.2;
        logo.style.transform = `translate(${x}px, ${y}px)`;
    });
    
    logo.addEventListener('mouseleave', () => {
        logo.style.transform = `translate(0, 0)`;
    });

});
