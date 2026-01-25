// GSAP ScrollTrigger Animations for Home Page
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Sync Lenis with ScrollTrigger
if (window.lenis) {
    window.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        window.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

// Check for reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    // Hero parallax effect
    const heroTitle = document.querySelector('[data-section="hero"] h1');
    if (heroTitle) {
        gsap.to(heroTitle, {
            yPercent: 50,
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: {
                trigger: '[data-section="hero"]',
                start: 'top top',
                end: 'bottom top',
                scrub: true,
            },
        });
    }

    // Pin chapter sections
    const chapters = document.querySelectorAll('[data-pin="true"]');
    chapters.forEach((chapter) => {
        ScrollTrigger.create({
            trigger: chapter,
            start: 'top top',
            end: 'bottom bottom',
            pin: true,
            pinSpacing: false,
        });

        // Fade in image on scroll
        const image = chapter.querySelector('img');
        if (image) {
            gsap.from(image, {
                scale: 1.2,
                opacity: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: chapter,
                    start: 'top center',
                    end: 'center center',
                    scrub: 1,
                },
            });
        }

        // Slide in text content
        const textContent = chapter.querySelector('.flex-1');
        if (textContent) {
            gsap.from(textContent, {
                x: -100,
                opacity: 0,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: chapter,
                    start: 'top center',
                    end: 'center center',
                    scrub: 1,
                },
            });
        }
    });

    // Panorama parallax
    const panoramas = document.querySelectorAll('[data-section="panorama"]');
    panoramas.forEach((panorama) => {
        const bg = panorama.querySelector('.absolute.inset-0');
        if (bg) {
            gsap.to(bg, {
                yPercent: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: panorama,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }
    });

    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('[data-fade]');
    fadeElements.forEach((el) => {
        gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse',
            },
        });
    });
}
