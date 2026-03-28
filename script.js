// ==========================================
// D&M CARROZZERIA - MAIN JAVASCRIPT
// Versión Consolidada y Limpia
// ==========================================

/* ==========================================
   TABLA DE CONTENIDOS:
   1. Variables Globales
   2. Loader & Progress Bar
   2.5. Animated Particles System
   3. Scroll Animations
   4. Navigation
   5. Color Lab
   6. Before/After Slider
   7. Pricing Calculator
   8. Modal System
   9. FAQ Accordion
   10. Cookie Banner
   11. WhatsApp Integration
   12. Status Checker
   13. 3D Tilt Effects
   14. Mobile Menu
   15. Dark/Light Theme Toggle
   16. Testimonials Carousel
   17. Lazy Loading
   18. Gallery Lightbox
   19. Chatbot Functionality
   ========================================== */


// ==========================================
// 1. VARIABLES GLOBALES
// ==========================================
var selectedParts = [];
var priceMultiplier = 1;
let countersStarted = false;


// ==========================================
// 2. LOADER & PROGRESS BAR
// ==========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Activar animación inicial del hero
            const heroReveal = document.querySelector('.hero-content .reveal');
            if (heroReveal) heroReveal.classList.add('active');
        }, 800);
    }, 1500);
    
    // Iniciar partículas después de que cargue la página
    initParticles();
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressBar = document.getElementById("scroll-progress");
    if (progressBar) {
        progressBar.style.width = scrolled + "%";
    }

    // Navbar scroll effect
    const nav = document.getElementById('navbar');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});


// ==========================================
// 2.5 ANIMATED PARTICLES SYSTEM
// ==========================================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Clase Partícula
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
            
            // Colores variados
            const colors = [
                'rgba(0, 128, 128, 0.6)',    // Primary
                'rgba(255, 191, 0, 0.6)',    // Accent
                'rgba(102, 126, 234, 0.6)',  // Purple
                'rgba(75, 192, 192, 0.6)'    // Teal
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Rebotar en los bordes
            if (this.x > canvas.width || this.x < 0) {
                this.speedX *= -1;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY *= -1;
            }
            
            // Pequeña variación aleatoria en la dirección
            this.speedX += (Math.random() - 0.5) * 0.02;
            this.speedY += (Math.random() - 0.5) * 0.02;
            
            // Limitar velocidad
            const maxSpeed = 1;
            this.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedX));
            this.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedY));
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Crear partículas iniciales
    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Conectar partículas cercanas
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(0, 128, 128, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animar partículas
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // Iniciar
    createParticles();
    animate();
    
    // Limpiar al cambiar de página
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationFrameId);
    });
}


// ==========================================
// 3. SCROLL ANIMATIONS (Intersection Observer)
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Si es la sección de estadísticas, iniciar contadores
            if (entry.target.closest('.stats-container')) {
                startCounters();
            }
        }
    });
}, { threshold: 0.15 });

// Observar todos los elementos con clase 'reveal'
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});


// ==========================================
// 4. NUMBER COUNTERS (Stats)
// ==========================================
function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    
    document.querySelectorAll('.stat-num').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // milisegundos
        const step = Math.ceil(target / (duration / 16));
        
        let current = 0;
        const update = () => {
            current += step;
            if (current < target) {
                counter.innerText = current;
                requestAnimationFrame(update);
            } else {
                counter.innerText = target;
            }
        };
        update();
    });
}


// ==========================================
// 5. COLOR LAB - Cambio de Color del Auto
// ==========================================
function changeCarColor(color, name, btn) {
    const stage = document.getElementById('carStage');
    const colorName = document.getElementById('colorName');
    
    if (stage) {
        stage.style.background = color;
        stage.style.setProperty('--glow-color', color);
    }
    
    if (colorName) {
        colorName.innerText = name;
    }
    
    // Gestionar botones activos
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

// Cambio de Acabado (Finish)
function setFinish(type, btn) {
    const stage = document.getElementById('carStage');
    
    if (stage) {
        // Remover todas las clases de acabado previas
        stage.classList.remove('finish-matte', 'finish-metallic', 'finish-pearl');
        
        // Añadir la nueva clase (si no es standard)
        if (type !== 'standard') {
            stage.classList.add('finish-' + type);
        }
    }
    
    // Gestionar botones activos
    document.querySelectorAll('.finish-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}


// ==========================================
// 6. BEFORE/AFTER SLIDER (DRAGGABLE)
// ==========================================
function moveSlider(val) {
    const imgAfter = document.getElementById('imgAfter');
    const handle = document.getElementById('sliderHandle');

    if (imgAfter) {
        imgAfter.style.width = val + "%";
    }
    
    if (handle) {
        handle.style.left = val + "%";
    }
}

// Draggable slider setup
(function() {
    function initDraggableSlider() {
        const slider = document.getElementById('comparisonSlider');
        if (!slider) return;
        
        const container = slider.querySelector('.img-container');
        let isDragging = false;

        function getPercentage(e) {
            const rect = container.getBoundingClientRect();
            let clientX;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            let pct = ((clientX - rect.left) / rect.width) * 100;
            pct = Math.max(2, Math.min(98, pct));
            return pct;
        }

        function onMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            moveSlider(getPercentage(e));
        }

        function onEnd() {
            isDragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        }

        function onStart(e) {
            isDragging = true;
            moveSlider(getPercentage(e));
            document.addEventListener('mousemove', onMove, { passive: false });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        }

        container.addEventListener('mousedown', onStart);
        container.addEventListener('touchstart', onStart, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDraggableSlider);
    } else {
        initDraggableSlider();
    }
})();


// ==========================================
// 7. PRICING CALCULATOR
// ==========================================

// Función para cambiar el acabado de pintura
function updatePriceModifier() {
    const selector = document.getElementById('paintFinish');
    if (selector) {
        priceMultiplier = parseFloat(selector.value);
        calculateTotal();
    }
}

// Función principal de selección de partes
window.togglePart = function(arg1, arg2, arg3, arg4) {
    let event, btn, price, name;

    // Detectar qué tipo de llamada es (con o sin evento)
    if (arg1 && (arg1 instanceof Event || arg1.type === 'click')) {
        // HTML nuevo: togglePart(event, this, price, name)
        event = arg1;
        btn = arg2;
        price = arg3;
        name = arg4;
    } else {
        // HTML viejo: togglePart(this, price, name)
        event = window.event;
        btn = arg1;
        price = arg2;
        name = arg3;
    }

    if (!btn) { 
        console.error("Error: No se encontró el botón"); 
        return; 
    }

    // Efecto de partículas solo al activar
    if (!btn.classList.contains('active') && event) {
        createParticles(event, btn);
    }

    // Toggle del estado
    btn.classList.toggle('active');
    
    // Actualizar array de partes seleccionadas
    if (btn.classList.contains('active')) {
        // Evitar duplicados
        const exists = selectedParts.find(p => p.name === name);
        if (!exists) {
            selectedParts.push({ name: name, price: price });
        }
    } else {
        selectedParts = selectedParts.filter(part => part.name !== name);
    }
    
    // Recalcular total
    calculateTotal();
}

// Función para crear partículas
window.createParticles = function(event, btnElement) {
    let x, y;
    
    if (event && event.clientX) {
        x = event.clientX;
        y = event.clientY;
    } else {
        const rect = btnElement.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
    }

    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('span');
        particle.classList.add('particle');
        document.body.appendChild(particle);

        const colors = ['var(--primary)', '#00d4ff', '#ffffff'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 60;
        const destinationX = Math.cos(angle) * distance;
        const destinationY = Math.sin(angle) * distance;

        particle.style.setProperty('--tx', `${destinationX}px`);
        particle.style.setProperty('--ty', `${destinationY}px`);
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        setTimeout(() => particle.remove(), 600);
    }
}

// Función para calcular el total
window.calculateTotal = function() {
    const listElement = document.getElementById('selectedList');
    const totalElement = document.getElementById('totalPrice');
    
    if (!listElement || !totalElement) return;

    listElement.innerHTML = '';
    let baseTotal = 0;

    if (selectedParts.length === 0) {
        listElement.innerHTML = '<li style="color: #aaa;">Nessuna parte selezionata...</li>';
        totalElement.innerText = '0';
        return;
    }

    selectedParts.forEach(part => {
        baseTotal += part.price;
        let li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.marginBottom = '8px';
        li.innerHTML = `${part.name} <span style="font-weight:bold">€${part.price}</span>`;
        listElement.appendChild(li);
    });

    let finalTotal = baseTotal * priceMultiplier;
    finalTotal = Math.round(finalTotal);
    totalElement.innerText = finalTotal;
}

// Función para reservar por WhatsApp desde el calculador
window.bookEstimate = function() {
    if (selectedParts.length === 0) {
        alert("Seleziona almeno una parte dell'auto.");
        return;
    }
    
    const total = document.getElementById('totalPrice').innerText;
    let finishName = "Standard";
    const selector = document.getElementById('paintFinish');
    if(selector) {
        finishName = selector.options[selector.selectedIndex].text;
    }
    
    let message = `🤖 Ciao! Vorrei un preventivo.\n\n*Finitura:* ${finishName}\n*Parti:*\n`;
    selectedParts.forEach(p => {
        message += `- ${p.name}\n`;
    });
    message += `\n*Stima Web:* €${total}`;
    
    // Cambiar este número por el tuyo
    window.open(`https://wa.me/391234567890?text=${encodeURIComponent(message)}`, '_blank');
}

// Listener para el selector de acabado
document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('paintFinish');
    if (selector) {
        selector.addEventListener('change', updatePriceModifier);
    }
});


// ==========================================
// 8. MODAL SYSTEM
// ==========================================
function toggleModal() {
    const modal = document.getElementById('bookingModal');
    
    if (!modal) return;
    
    if (modal.classList.contains('modal-active')) {
        modal.classList.remove('modal-active');
        setTimeout(() => modal.style.display = 'none', 300);
    } else {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('modal-active'), 10);
    }
}


// ==========================================
// 9. FAQ ACCORDION
// ==========================================
function toggleFaq(element) {
    const item = element.parentElement;
    const answer = item.querySelector('.faq-answer');
    
    if (!item || !answer) return;
    
    item.classList.toggle('active');
    
    if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
        answer.style.maxHeight = "0";
    }
}


// ==========================================
// 10. COOKIE BANNER
// ==========================================
function acceptCookies() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        banner.style.display = 'none';
    }
    localStorage.setItem('novaCookieConsent', 'accepted');
    console.log("Cookies aceptadas correctamente.");
}

function rejectCookies() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        banner.style.display = 'none';
    }
    localStorage.setItem('novaCookieConsent', 'rejected');
    console.log("Cookies rechazadas.");
}

// Mostrar el banner al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const decision = localStorage.getItem('novaCookieConsent');
    
    if (!decision) {
        setTimeout(() => {
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.classList.add('show');
                banner.style.display = 'flex';
            }
        }, 2000);
    }
});


// ==========================================
// 11. WHATSAPP INTEGRATION (Modal Form)
// ==========================================
function enviarWhatsapp(e) {
    e.preventDefault();

    const nombre = document.getElementById('wa_nombre')?.value || '';
    const telefono = document.getElementById('wa_telefono')?.value || '';
    const servicio = document.getElementById('wa_servicio')?.value || '';
    const mensaje = document.getElementById('wa_mensaje')?.value || '';

    // Cambiar este número por el tuyo
    const numeroTaller = "391234567890"; 

    const texto = 
        `👋 Ciao D&M Meccatronica e Carrozzeria, vorrei un preventivo.%0A%0A` +
        `👤 *Nome:* ${nombre}%0A` +
        `📞 *Telefono:* ${telefono}%0A` +
        `🚗 *Servizio:* ${servizio}%0A` +
        `📝 *Note:* ${mensaje}`;

    window.open(`https://wa.me/${numeroTaller}?text=${texto}`, '_blank');

    try { 
        toggleModal(); 
    } catch(err) {
        console.log('No se pudo cerrar el modal automáticamente');
    }
}


// ==========================================
// 12. STATUS CHECKER (Horario de Apertura)
// ==========================================
function checkStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 6 = Sábado
    const hour = now.getHours();
    
    let isOpen = false;
    
    // Lunes a Viernes 08:00-18:00
    if (day >= 1 && day <= 5 && hour >= 8 && hour < 18) {
        isOpen = true;
    }
    
    // Sábado 09:00-12:00
    if (day === 6 && hour >= 9 && hour < 12) {
        isOpen = true;
    }

    // Badge desktop
    const badge = document.getElementById('status-badge');
    if (badge) {
        if (isOpen) {
            badge.style.background = '#d4edda';
            badge.style.color = '#155724';
            badge.innerText = '● APERTO';
        } else {
            badge.style.background = '#f8d7da';
            badge.style.color = '#721c24';
            badge.innerText = '● CHIUSO';
        }
    }

    // Badge móvil
    const mobileBadge = document.getElementById('mobile-status-badge');
    const mobileStatusDot = document.querySelector('.mobile-status-dot');
    const mobileStatusText = document.querySelector('.mobile-status-text');
    
    if (mobileBadge && mobileStatusDot && mobileStatusText) {
        if (isOpen) {
            mobileBadge.style.background = 'rgba(76, 175, 80, 0.15)';
            mobileBadge.style.borderLeft = '4px solid #4caf50';
            mobileStatusDot.style.background = '#4caf50';
            mobileStatusText.textContent = 'APERTO';
            mobileStatusText.style.color = '#4caf50';
        } else {
            mobileBadge.style.background = 'rgba(255, 82, 82, 0.15)';
            mobileBadge.style.borderLeft = '4px solid #ff5252';
            mobileStatusDot.style.background = '#ff5252';
            mobileStatusText.textContent = 'CHIUSO';
            mobileStatusText.style.color = '#ff5252';
        }
    }
}

document.addEventListener('DOMContentLoaded', checkStatus);


// ==========================================
// 13. MOBILE MENU
// ==========================================
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}


// ==========================================
// 14. 3D TILT EFFECTS (Service Cards)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });
});


// ==========================================
// 15. DARK/LIGHT THEME TOGGLE
// ==========================================
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Cambiar icono del botón
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        if (newTheme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }
}

// Cargar tema guardado al iniciar
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = document.querySelector('#theme-toggle i');
    if (icon && savedTheme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    }
});


// ==========================================
// 16. TESTIMONIALS CAROUSEL
// ==========================================
let currentTestimonial = 0;

function changeTestimonial(direction) {
    const items = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    if (!items.length) return;
    
    // Remover clase active del testimonio actual
    items[currentTestimonial].classList.remove('active');
    dots[currentTestimonial].classList.remove('active');
    
    // Calcular nuevo índice
    currentTestimonial += direction;
    
    // Loop circular
    if (currentTestimonial < 0) {
        currentTestimonial = items.length - 1;
    } else if (currentTestimonial >= items.length) {
        currentTestimonial = 0;
    }
    
    // Añadir clase active al nuevo testimonio
    items[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
}

function goToTestimonial(index) {
    const items = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    if (!items.length) return;
    
    items[currentTestimonial].classList.remove('active');
    dots[currentTestimonial].classList.remove('active');
    
    currentTestimonial = index;
    
    items[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
}

// Auto-rotate testimonials cada 5 segundos
let testimonialInterval;

function startTestimonialAutoRotate() {
    testimonialInterval = setInterval(() => {
        changeTestimonial(1);
    }, 5000);
}

function stopTestimonialAutoRotate() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
}

// Iniciar auto-rotate cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.testimonial-item')) {
        startTestimonialAutoRotate();
        
        // Pausar en hover
        const container = document.querySelector('.testimonials-container');
        if (container) {
            container.addEventListener('mouseenter', stopTestimonialAutoRotate);
            container.addEventListener('mouseleave', startTestimonialAutoRotate);
        }
    }
});


// ==========================================
// 17. LAZY LOADING DE IMÁGENES
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Lazy loading para todas las imágenes con clase 'lazy'
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // La imagen se cargará automáticamente gracias al atributo loading="lazy"
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Optimización adicional: Añadir loading="lazy" a imágenes de galería
    document.querySelectorAll('.gallery-item img, .case-study-image img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
});


// ==========================================
// 18. GALLERY LIGHTBOX
// ==========================================

// Array de imágenes de la galería
const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1200",
        caption: "Verniciatura Completa BMW"
    },
    {
        src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200",
        caption: "Levabolli Grandine Mercedes"
    },
    {
        src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200",
        caption: "Restauro Tesla Model S"
    },
    {
        src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200",
        caption: "Riparazione Paraurti Audi"
    },
    {
        src: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200",
        caption: "Verniciatura Opaca Porsche"
    },
    {
        src: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200",
        caption: "Riparazione Cofano Ferrari"
    },
    {
        src: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1200",
        caption: "Restauro Completo Range Rover"
    },
    {
        src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200",
        caption: "Verniciatura Metallizzata"
    },
    {
        src: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1200",
        caption: "Riparazione Sportiva"
    }
];

let currentImageIndex = 0;

// Abrir lightbox con imagen específica
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    
    if (lightbox && img && caption && counter) {
        img.src = galleryImages[index].src;
        caption.innerText = galleryImages[index].caption;
        counter.innerText = `${index + 1} / ${galleryImages.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
}

// Cerrar lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
    }
}

// Cambiar imagen en el lightbox
function changeLightboxImage(direction) {
    currentImageIndex += direction;
    
    // Loop circular
    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }
    
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const counter = document.getElementById('lightbox-counter');
    
    if (img && caption && counter) {
        img.src = galleryImages[currentImageIndex].src;
        caption.innerText = galleryImages[currentImageIndex].caption;
        counter.innerText = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            changeLightboxImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeLightboxImage(1);
        }
    }
});


// ==========================================
// 19. CHATBOT FUNCTIONALITY
// ==========================================

// Estado del chatbot
let chatbotOpen = false;
let conversationState = 'initial';
let chatHistory = [];

// Árbol de conversación
const chatFlows = {
    initial: {
        message: "👋 Ciao! Sono l'assistente virtuale di D&M Meccatronica e Carrozzeria. Come posso aiutarti oggi?",
        options: [
            { text: "📋 Informazioni sui Servizi", icon: "fa-list", next: "servizi" },
            { text: "💰 Prezzi e Preventivi", icon: "fa-euro-sign", next: "prezzi" },
            { text: "⏰ Orari e Prenotazioni", icon: "fa-clock", next: "orari" },
            { text: "🚗 Domande sulla Riparazione", icon: "fa-wrench", next: "riparazione" }
        ]
    },
    
    servizi: {
        message: "Perfetto! Offriamo diversi servizi specializzati. Cosa ti interessa?",
        options: [
            { text: "🎨 Verniciatura", next: "verniciatura" },
            { text: "⚡ Riparazione Grandine", next: "grandine" },
            { text: "🔌 Veicoli Elettrici", next: "elettrici" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    verniciatura: {
        message: "La nostra verniciatura è robotica con sistema 4.0. Include:\n\n✅ Corrispondenza colore al 99.9%\n✅ Cabina a forno pressurizzata\n✅ Vernici eco-friendly all'acqua\n✅ Garanzia a vita\n\nTempo medio: 3-5 giorni",
        options: [
            { text: "💰 Quanto costa?", next: "costo_verniciatura" },
            { text: "📞 Voglio prenotare", next: "prenota" },
            { text: "↩️ Altri servizi", next: "servizi" }
        ]
    },
    
    grandine: {
        message: "Specialisti in riparazione danni da grandine con tecnica PDR:\n\n✅ Senza riverniciatura\n✅ Preserva vernice originale\n✅ Risparmio fino al 70%\n✅ Tempi ridotti (2-5 giorni)\n\nPerfetto per auto con ammaccature multiple!",
        options: [
            { text: "💰 Preventivo gratuito", next: "preventivo_grandine" },
            { text: "📞 Contattaci", next: "prenota" },
            { text: "↩️ Altri servizi", next: "servizi" }
        ]
    },
    
    elettrici: {
        message: "Siamo certificati PES/PAV per veicoli elettrici! 🔋\n\n✅ Personale specializzato\n✅ Sicurezza garantita\n✅ Lavoriamo su Tesla, BMW i, Audi e-tron, ecc.\n✅ Rispetto dei protocolli del produttore",
        options: [
            { text: "📋 Ho una Tesla/EV", next: "prenota" },
            { text: "❓ È sicuro?", next: "sicurezza_ev" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    prezzi: {
        message: "I nostri prezzi dipendono dal tipo di danno. Esempi indicativi:\n\n🚗 Portiera: €250-400\n🚗 Cofano: €300-500\n🚗 Paraurti: €200-350\n🚗 Verniciatura completa: preventivo personalizzato\n\nTi serve un preventivo preciso?",
        options: [
            { text: "📸 Sì, mando foto del danno", next: "preventivo_foto" },
            { text: "🧮 Usa la calcolatrice", next: "calcolatrice" },
            { text: "📞 Parlo con un tecnico", next: "prenota" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    orari: {
        message: "📍 Siamo a Firenzuola (FI)\n\n🕐 Orari:\n• Lun-Ven: 08:00 - 18:00\n• Sabato: 09:00 - 12:00\n• Domenica: Chiuso\n\n✅ Auto di cortesia gratuita disponibile!",
        options: [
            { text: "📅 Prenota un appuntamento", next: "prenota" },
            { text: "🗺️ Come arrivare", next: "mappa" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    riparazione: {
        message: "Hai domande sulla riparazione? Dimmi:",
        options: [
            { text: "⏱️ Quanto tempo ci vuole?", next: "tempo" },
            { text: "🏥 Gestite assicurazioni?", next: "assicurazione" },
            { text: "🚗 Avete auto di cortesia?", next: "cortesia" },
            { text: "📋 Garanzia?", next: "garanzia" }
        ]
    },
    
    tempo: {
        message: "I tempi dipendono dal lavoro:\n\n⚡ Piccoli ritocchi: 1-2 giorni\n🚗 Verniciatura parziale: 3-5 giorni\n🎨 Verniciatura completa: 5-7 giorni\n☁️ Riparazione grandine: 2-5 giorni\n\nHai un'urgenza?",
        options: [
            { text: "✅ Sì, è urgente", next: "urgente" },
            { text: "📞 Voglio prenotare", next: "prenota" },
            { text: "↩️ Altre domande", next: "riparazione" }
        ]
    },
    
    assicurazione: {
        message: "Sì! Offriamo la Cessione del Credito:\n\n✅ Zero anticipo da parte tua\n✅ Ci facciamo pagare direttamente dall'assicurazione\n✅ Lavoriamo con tutte le principali compagnie\n✅ Ti serve solo il modulo CAI (blu)\n\nComodo, vero? 😊",
        options: [
            { text: "📋 Come funziona nel dettaglio?", next: "dettagli_assicurazione" },
            { text: "📞 Ho un sinistro, cosa faccio?", next: "prenota" },
            { text: "↩️ Altre domande", next: "riparazione" }
        ]
    },
    
    cortesia: {
        message: "Sì, abbiamo 3 auto di cortesia! 🚗\n\n✅ Gratuita per interventi oltre 3 giorni\n✅ Inclusa una microcar elettrica\n✅ Soggetta a disponibilità (meglio prenotare)\n\nVuoi riservarne una?",
        options: [
            { text: "✅ Sì, la prenoto", next: "prenota" },
            { text: "↩️ Altre domande", next: "riparazione" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    garanzia: {
        message: "Le nostre garanzie:\n\n✅ Verniciatura: GARANZIA A VITA\n✅ Riparazioni: 24 mesi\n✅ PDR Grandine: 12 mesi\n\nCertificata Nova Paint. Siamo sicuri del nostro lavoro! 💪",
        options: [
            { text: "🤩 Ottimo! Prenoto", next: "prenota" },
            { text: "↩️ Altre domande", next: "riparazione" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    costo_verniciatura: {
        message: "La verniciatura completa dipende dal veicolo:\n\n• Microcar: €1.500 - €2.000\n• Berlina media: €2.500 - €3.500\n• SUV/Premium: €3.500 - €5.000\n\nInclude tutto: smontaggio, preparazione, robot, forno, rimontaggio.",
        options: [
            { text: "📸 Chiedo preventivo preciso", next: "preventivo_foto" },
            { text: "📞 Parlo con un tecnico", next: "prenota" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    preventivo_foto: {
        message: "Perfetto! Per un preventivo accurato:\n\n📸 Invia 3-4 foto del danno via WhatsApp\n📝 Indica marca, modello e anno\n⏰ Risposta in max 2 ore (orario lavorativo)\n\nTi apro WhatsApp?",
        options: [
            { text: "✅ Sì, apri WhatsApp", next: "whatsapp" },
            { text: "📞 Preferisco chiamare", next: "telefono" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    preventivo_grandine: {
        message: "Per la grandine serve una visita:\n\n👁️ Dobbiamo vedere l'entità dei danni\n📸 Le foto non bastano per un preventivo accurato\n⚡ Valutazione gratuita in officina (20 min)\n\nVuoi fissare un appuntamento?",
        options: [
            { text: "📅 Sì, prenoto la valutazione", next: "prenota" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    calcolatrice: {
        message: "Ottima idea! Ti porto alla nostra calcolatrice interattiva dove puoi selezionare le parti da riverniciare e vedere subito una stima. 🧮",
        options: [
            { text: "🧮 Vai alla Calcolatrice", action: "goToCalculator" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    mappa: {
        message: "📍 Ci trovi qui:\n\nVia Provinciale, 50033 Firenzuola (FI)\n\nDalla SS 65: Uscita Firenzuola centro\nDalla A1: Uscita Barberino del Mugello + 20 min\n\nTi mando alla mappa?",
        options: [
            { text: "🗺️ Sì, apri mappa", action: "goToMap" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    urgente: {
        message: "Capisco! Per urgenze:\n\n⚡ Servizio Fast Repair disponibile\n📞 Chiamaci subito per verificare disponibilità\n🚗 Eventuale auto di cortesia immediata\n\n+39 123 456 7890",
        options: [
            { text: "📞 Chiama ora", action: "call" },
            { text: "💬 Manda WhatsApp", next: "whatsapp" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    sicurezza_ev: {
        message: "Assolutamente sicuro! 🔒\n\n✅ Personale certificato PES/PAV\n✅ Protocolli specifici per batterie\n✅ Attrezzatura isolata\n✅ Esperienza con tutti i brand EV\n\nLa sicurezza è la nostra priorità numero uno.",
        options: [
            { text: "✅ Perfetto, prenoto", next: "prenota" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    dettagli_assicurazione: {
        message: "Ecco come funziona:\n\n1️⃣ Porti l'auto + modulo CAI\n2️⃣ Noi fotografiamo e documentiamo\n3️⃣ Inviamo tutto all'assicurazione\n4️⃣ Ripariamo l'auto\n5️⃣ Ritiri senza pagare\n\nSemplice e senza stress! 😊",
        options: [
            { text: "📞 Ho il modulo, prenoto", next: "prenota" },
            { text: "❓ Non ho il modulo", next: "no_modulo" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    no_modulo: {
        message: "Nessun problema! Il modulo CAI (blu) lo richiedi alla tua assicurazione:\n\n📞 Chiama il numero verde\n📧 Oppure scaricalo dal sito\n⏱️ Di solito arriva in 24-48h\n\nUna volta che ce l'hai, siamo pronti! 👍",
        options: [
            { text: "✅ Ok, lo richiedo", next: "prenota" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    prenota: {
        message: "Perfetto! Vuoi prenotare subito? 📅\n\nPuoi:\n• Chiamarci direttamente\n• Mandarci un messaggio WhatsApp\n• Compilare il form sul sito\n\nCosa preferisci?",
        options: [
            { text: "📞 Chiamata", action: "call" },
            { text: "💬 WhatsApp", next: "whatsapp" },
            { text: "📝 Form sul sito", action: "openModal" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    },
    
    whatsapp: {
        message: "Ottimo! Ti apro WhatsApp ora. 💬\n\nRicordati di dirci:\n✅ Nome e numero\n✅ Tipo di servizio\n✅ Urgenza/disponibilità\n\nTi rispondiamo in 30 minuti! ⚡",
        options: [
            { text: "💬 Apri WhatsApp", action: "openWhatsApp" }
        ]
    },
    
    telefono: {
        message: "Chiamaci al:\n\n📞 +39 123 456 7890\n\n⏰ Lun-Ven: 08:00-18:00\n⏰ Sab: 09:00-12:00\n\nSiamo pronti ad aiutarti! 😊",
        options: [
            { text: "📞 Chiama ora", action: "call" },
            { text: "💬 Preferisco WhatsApp", next: "whatsapp" },
            { text: "↩️ Torna al Menu", next: "initial" }
        ]
    }
};

// Toggle chatbot
function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    const chatWindow = document.getElementById('chatbot-window');
    const chatToggle = document.getElementById('chatbot-toggle');
    const badge = document.querySelector('.chatbot-badge');
    
    if (chatbotOpen) {
        chatWindow.classList.add('open');
        chatToggle.classList.add('active');
        if (badge) badge.style.display = 'none';
        
        // Iniciar conversación si es la primera vez
        if (chatHistory.length === 0) {
            setTimeout(() => showBotMessage(chatFlows.initial.message), 500);
            setTimeout(() => showContinueButton(chatFlows.initial.options), 1500);
        }
    } else {
        chatWindow.classList.remove('open');
        chatToggle.classList.remove('active');
    }
}

// Mostrar mensaje del bot
function showBotMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Mostrar indicador de escritura
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
        <img src="logooo.png" alt="Bot" class="message-avatar">
        <div class="typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Después de 1 segundo, mostrar el mensaje real
    setTimeout(() => {
        typingIndicator.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.innerHTML = `
            <img src="logooo.png" alt="Bot" class="message-avatar">
            <div class="message-bubble">${message.replace(/\n/g, '<br>')}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        chatHistory.push({ type: 'bot', message });
    }, 1000);
}

// Mostrar mensaje del usuario
function showUserMessage(message) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `
        <div class="message-bubble">${message}</div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    chatHistory.push({ type: 'user', message });
}

// Mostrar opciones
function showOptions(options) {
    const optionsContainer = document.getElementById('chatbot-options');
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'chat-option';
        button.innerHTML = `${option.text}`;
        button.onclick = () => handleOptionClick(option);
        optionsContainer.appendChild(button);
    });
}

// Mostrar botón "Continua"
function showContinueButton(nextOptions) {
    const optionsContainer = document.getElementById('chatbot-options');
    optionsContainer.innerHTML = '';
    
    const button = document.createElement('button');
    button.className = 'chat-continue-btn';
    button.innerHTML = `Continua <i class="fa-solid fa-arrow-right"></i>`;
    button.onclick = () => {
        optionsContainer.innerHTML = '';
        showOptions(nextOptions);
    };
    optionsContainer.appendChild(button);
}

// Manejar click en opción
function handleOptionClick(option) {
    // Mostrar la selección del usuario
    showUserMessage(option.text);
    
    // Limpiar opciones
    document.getElementById('chatbot-options').innerHTML = '';
    
    // Ejecutar acción o continuar conversación
    setTimeout(() => {
        if (option.action) {
            executeAction(option.action);
        } else if (option.next) {
            const nextFlow = chatFlows[option.next];
            showBotMessage(nextFlow.message);
            // Mostrar botón "Continua" en lugar de opciones directas
            setTimeout(() => showContinueButton(nextFlow.options), 1500);
            conversationState = option.next;
        }
    }, 500);
}

// Ejecutar acciones especiales
function executeAction(action) {
    switch(action) {
        case 'openWhatsApp':
            window.open('https://wa.me/391234567890?text=Ciao!%20Vorrei%20informazioni%20su...', '_blank');
            showBotMessage("WhatsApp aperto! Scrivici pure. 😊");
            setTimeout(() => showContinueButton([{ text: "↩️ Torna al Menu", next: "initial" }]), 1500);
            break;
            
        case 'call':
            window.location.href = 'tel:+391234567890';
            break;
            
        case 'goToCalculator':
            toggleChatbot();
            setTimeout(() => {
                document.getElementById('prezzi').scrollIntoView({ behavior: 'smooth' });
            }, 300);
            break;
            
        case 'goToMap':
            toggleChatbot();
            setTimeout(() => {
                document.getElementById('dove-siamo').scrollIntoView({ behavior: 'smooth' });
            }, 300);
            break;
            
        case 'openModal':
            toggleChatbot();
            setTimeout(() => toggleModal(), 300);
            break;
    }
}

// Resetear chat
function resetChat() {
    chatHistory = [];
    conversationState = 'initial';
    document.getElementById('chatbot-messages').innerHTML = '';
    document.getElementById('chatbot-options').innerHTML = '';
    
    setTimeout(() => showBotMessage(chatFlows.initial.message), 500);
    setTimeout(() => showContinueButton(chatFlows.initial.options), 1500);
}

// Inicializar chatbot al cargar
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar badge después de 3 segundos para llamar la atención
    setTimeout(() => {
        const badge = document.querySelector('.chatbot-badge');
        if (badge && !chatbotOpen) {
            badge.style.display = 'flex';
        }
    }, 3000);
});


// ==========================================
// FIN DEL SCRIPT
// ==========================================
console.log('D&M Meccatronica e Carrozzeria - Sistema cargado correctamente ✓');