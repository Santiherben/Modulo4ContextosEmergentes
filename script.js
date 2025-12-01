// ==========================================
// Variables globales
// ==========================================
let currentSection = 0;
const totalSections = 5;  // 0: intro, 1: contexto, 2: aspectos, 3: propuesta, 4: bibliografía

// Estado de los carruseles
const carouselStates = {
    contexto:      { angle: 0, total: 4 },
    espacial:      { angle: 0, total: 3 },
    tecnologica:   { angle: 0, total: 3 },
    pedagogica:    { angle: 0, total: 3 },
    socioemocional:{ angle: 0, total: 3 },
    propuesta:     { angle: 0, total: 5 }
};

// Fondos dinámicos por sección (Rosan Bosch vibes 😄)
const dynamicBackgrounds = {
    propuesta: {
        images: [
            'imagenes/img18.jpg',
            'imagenes/img19.jpeg',
            'imagenes/img20.jpeg',
            'imagenes/img21.jpeg',
            'imagenes/img22.jpeg'
        ],
        current: 0
    },
    bibliografia: {
        images: [
            'imagenes/img5.png',
            'imagenes/img8.png',
            'imagenes/img19.jpeg'
        ],
        current: 0
    }
};

// ==========================================
// Inicialización
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCarousels();
    initCircularMenu();
    initHotspots();
    initDynamicBackgrounds();
    updateProgressBar();
    
    // Navegación por rueda del mouse (scroll entre secciones)
    let isScrolling = false;
    window.addEventListener('wheel', function(e) {
        if (isScrolling) return;

        // Si estamos en la sección de bibliografía, dejamos que la rueda se use para leer
        if (currentSection === 4) return;

        isScrolling = true;
        
        if (e.deltaY > 0) {
            navigateSection(1);
        } else {
            navigateSection(-1);
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    });
});

// ==========================================
// Navegación entre secciones
// ==========================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionIndex = parseInt(this.dataset.section);
            goToSection(sectionIndex);
        });
    });
}

function navigateSection(direction) {
    const newSection = currentSection + direction;
    
    if (newSection >= 0 && newSection < totalSections) {
        goToSection(newSection);
    }
}

function goToSection(index) {
    const sections = document.querySelectorAll('.section');
    if (!sections[index]) return;

    // Ocultar sección actual
    sections[currentSection].classList.remove('active');
    
    // Mostrar nueva sección
    currentSection = index;
    sections[currentSection].classList.add('active');
    
    // Actualizar navegación (solo para secciones que tienen nav-item)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    if (navItems[currentSection]) {
        navItems[currentSection].classList.add('active');
    }
    
    // Actualizar barra de progreso
    updateProgressBar();
}

function updateProgressBar() {
    const progress = ((currentSection + 1) / totalSections) * 100;
    const bar = document.querySelector('.progress-bar');
    if (bar) {
        bar.style.width = progress + '%';
    }
}

// ==========================================
// Carruseles 3D
// ==========================================
function initCarousels() {
    // Inicializar posiciones de todos los carruseles
    Object.keys(carouselStates).forEach(carouselId => {
        updateCarouselPosition(carouselId);
    });
}

function rotateCarousel(carouselId, direction) {
    const state = carouselStates[carouselId];
    if (!state) return;

    const angleStep = 360 / state.total;
    
    state.angle += direction * angleStep;
    updateCarouselPosition(carouselId);
}

function updateCarouselPosition(carouselId) {
    const carousel = document.getElementById(carouselId + 'Carousel');
    if (!carousel) return;
    
    const state = carouselStates[carouselId];
    const cards = carousel.querySelectorAll('.carousel-card');
    const angleStep = 360 / state.total;
    const radius = 500; // Radio del carrusel en píxeles
    
    cards.forEach((card, index) => {
        const angle = (state.angle + (index * angleStep)) * Math.PI / 180;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius;
        const scale = (z + radius * 2) / (radius * 3);
        const opacity = scale;
        
        card.style.transform = `
            translateX(${x}px) 
            translateZ(${z}px) 
            scale(${scale})
        `;
        card.style.opacity = opacity;
        card.style.zIndex = Math.round(scale * 100);
    });
}

// ==========================================
// Menú Circular de Dimensiones
// ==========================================
function initCircularMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const dimension = this.dataset.dimension;
            showDimension(dimension);
            
            // Actualizar estado activo del menú
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Activar primera dimensión por defecto
    if (menuItems.length > 0) {
        menuItems[0].classList.add('active');
    }
}

function showDimension(dimensionId) {
    const contents = document.querySelectorAll('.dimension-content');
    
    contents.forEach(content => {
        content.classList.remove('active');
        if (content.id === dimensionId) {
            content.classList.add('active');
        }
    });
}

// ==========================================
// Hotspots del Plano Interactivo
// ==========================================
function initHotspots() {
    const hotspots = document.querySelectorAll('.hotspot');
    const infoPanel = document.querySelector('.zone-info-panel');
    if (!infoPanel) return;

    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', function() {
            const zone = this.dataset.zone;
            showZoneInfo(zone, infoPanel);
            
            // Resaltar hotspot activo
            hotspots.forEach(h => h.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showZoneInfo(zone, panel) {
    const zoneData = {
        cima: {
            title: 'Cima de la Montaña (≈15% del espacio)',
            description: `
                Ubicada en un extremo, con gradas o asientos cómodos en semicírculo y una pantalla
                interactiva de gran formato. Este espacio se utiliza para momentos puntuales de
                presentación, no es el centro del aula.<br><br>
                Si repensamos el aula, este espacio nos permite no usar la clase magistral para “dar”
                conceptos nuevos, sino poner en común, compartir, dar valor simbólico, reflexionar y 
                cerrar procesos de aprendizaje.<br><br>
                En formación médica de pregrado podría ser el lugar para cerrar un caso clínico, hacer 
                la puesta en común de razonamientos diagnósticos y terapéuticos, exponer las miradas 
                de diferentes especialidades médicas. Es un área muy rica que habilita la reflexión, 
                la retroalimentación docente y el aprendizaje entre pares.
            `
        },
        cueva: {
            title: 'Zonas de Cueva (≈20% del espacio)',
            description: `
                Rincones individuales con mobiliario que ofrece cierta privacidad visual: biombos,
                plantas, diferencias de nivel e iluminación más tenue. Puede incluir pequeñas cabinas
                acústicas. Los estudiantes vienen aquí cuando necesitan concentración profunda.<br><br>
                Es un área que favorece la introspección del estudiante, la meditación de la información
                más compleja y el desarrollo de un conocimiento propio. Es un espacio para pensar, 
                elaborar hipótesis y contrastar información.<br><br>
                En medicina se refleja en la elaboración diagnóstica individual: análisis de signos y 
                síntomas, integración de datos de la práctica diaria. Fortalece la toma de decisiones,
                favorece la autocrítica y la confianza, y ayuda a evitar seguir al grupo sin evidencia.
            `
        },
        corro: {
            title: 'Zonas de Corro (≈25% del espacio)',
            description: `
                Mesas redondas o hexagonales para 4–6 personas, móviles y reconfigurables. Cuentan con 
                acceso a pantallas compartidas para proyectar trabajos grupales y pizarras verticales 
                móviles para trabajo colaborativo.<br><br>
                Aquí se ubican las actividades colaborativas en torno a casos clínicos, discusión de 
                pacientes complejos y resolución conjunta de problemas. Es el lugar donde el docente 
                comparte su experiencia, y donde se construyen vínculos estudiante–docente que 
                promueven la empatía y la reflexión.<br><br>
                Es la zona donde se hace más visible el aprendizaje entre pares y la co-construcción de
                razonamientos diagnósticos y terapéuticos.
            `
        },
        manantial: {
            title: 'Zona de Manantial (≈15% del espacio)',
            description: `
                Espacio central con sofás, pufs, alfombras y un ambiente distendido. Puede incluir una 
                pequeña biblioteca o estantería con recursos. Es el espacio de encuentro informal y de 
                conversación espontánea.<br><br>
                En el contexto de la enseñanza de la medicina, esta zona actúa como puente entre el aula 
                y el hospital: permite la transición después de las prácticas clínicas, reduce la 
                fragmentación entre teoría y práctica y ofrece contención al grupo.<br><br>
                Favorece el bienestar del estudiante, el procesamiento emocional de experiencias 
                complejas y la construcción de comunidad profesional desde el pregrado.
            `
        },
        maker: {
            title: 'Zona de Manos a la Obra (≈20% del espacio)',
            description: `
                Mesas de trabajo amplias con acceso a herramientas y materiales, almacenamiento visible 
                de recursos y tecnologías maker (impresora 3D, simuladores, recursos de robótica, 
                modelos anatómicos, materiales de arte, etc.). Las superficies son lavables y se procura 
                conexión a tomas de agua cuando es posible.<br><br>
                Es el espacio donde se entrenan habilidades prácticas y comunicacionales: simulación
                clínica, role playing, entrenamiento de entrevistas, comunicación de malas noticias, 
                diseño de prototipos o materiales educativos para pacientes.<br><br>
                Las conversaciones entre docentes y estudiantes se dan en una lógica horizontal, reducen 
                las distancias jerárquicas y humanizan la figura del docente. Es una zona que habilita 
                el intercambio espontáneo, el ensayo y el error y el aprendizaje activo en un entorno 
                distendido.
            `
        }
    };

    const data = zoneData[zone];
    if (data) {
        panel.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.description}</p>
        `;
    }
}


// ==========================================
// Fondos dinámicos (imágenes en movimiento)
// ==========================================
function initDynamicBackgrounds() {
    Object.keys(dynamicBackgrounds).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const config = dynamicBackgrounds[sectionId];
        if (!config.images || config.images.length === 0) return;

        // Aseguramos la clase para que aplique el estilo .dynamic-bg del CSS
        section.classList.add('dynamic-bg');

        // Imagen inicial
        section.style.setProperty('--bg-image', `url('${config.images[0]}')`);

        // Si solo hay una imagen, no hace falta animar
        if (config.images.length === 1) return;

        // Rotación periódica de imágenes (cada 12s)
        setInterval(() => {
            config.current = (config.current + 1) % config.images.length;
            section.style.setProperty('--bg-image', `url('${config.images[config.current]}')`);
        }, 12000);
    });
}

// ==========================================
// Utilidades
// ==========================================

// Prevenir scroll horizontal
document.body.style.overflowX = 'hidden';

// Animación suave para elementos (intro cards y conclusión)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.intro-card, .conclusion-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});
