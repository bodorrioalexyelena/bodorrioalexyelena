document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. CONSTANTES Y FECHA DE LA BODA
    // ----------------------------------------------------
    // Fecha de la boda
    const fechaBoda = new Date("September 12, 2026 17:00:00").getTime();
    const SEGUNDO = 1000;
    const MINUTO = SEGUNDO * 60;
    const HORA = MINUTO * 60;
    const DIA = HORA * 24;

    // FIX: IDs de los elementos del contador principal y de navegación
    const navContador = document.getElementById('contador-dias-nav'); 
    const diasElement = document.getElementById('dias');
    const horasElement = document.getElementById('horas');
    const minutosElement = document.getElementById('minutos');
    const segundosElement = document.getElementById('segundos');
    
    // Bandera para el control de música
    let musicaReproduciendo = false;
    let primeraInteraccion = false;


    // ----------------------------------------------------
    // 2. FUNCIÓN DE CUENTA REGRESIVA
    // ----------------------------------------------------
    function actualizarContador() {
        const ahora = new Date().getTime();
        const distancia = fechaBoda - ahora;

        if (distancia < 0) {
            // Cuando la boda ya ha pasado
            clearInterval(intervaloContador);
            if (diasElement) diasElement.innerText = '00';
            if (horasElement) horasElement.innerText = '00';
            if (minutosElement) minutosElement.innerText = '00';
            if (segundosElement) segundosElement.innerText = '00';
            if (navContador) navContador.innerText = '¡HOY es el día!';
            return;
        }

        // Cálculo del tiempo restante
        const dias = Math.floor(distancia / DIA);
        const horas = Math.floor((distancia % DIA) / HORA);
        const minutos = Math.floor((distancia % HORA) / MINUTO);
        const segundos = Math.floor((distancia % MINUTO) / SEGUNDO);

        // Actualizar elementos 
        if (diasElement) diasElement.innerText = String(dias).padStart(2, '0');
        if (horasElement) horasElement.innerText = String(horas).padStart(2, '0');
        if (minutosElement) minutosElement.innerText = String(minutos).padStart(2, '0');
        if (segundosElement) segundosElement.innerText = String(segundos).padStart(2, '0');
        
        // Actualizar contador en la barra de navegación
        if (navContador) navContador.innerText = `${dias} DÍAS`;
    }

    // Inicializar y configurar el intervalo
    actualizarContador();
    const intervaloContador = setInterval(actualizarContador, 1000);


    // ----------------------------------------------------
    // 3. CONTROL DE MÚSICA Y AUTOPLAY HACK
    // ----------------------------------------------------
    const musicaFondo = document.getElementById('musicaFondo');
    const controlMusica = document.getElementById('controlMusica');
    // FIX: Obtenemos el ID del icono (añadido en index.html)
    const iconoMusica = document.getElementById('iconoMusica'); 
    
    // Establecer el volumen bajo
    musicaFondo.volume = 0.3;

    // Intentar reproducir música al primer clic en cualquier parte del documento
    document.body.addEventListener('click', () => {
        if (!primeraInteraccion) {
            musicaFondo.play()
                .then(() => {
                    musicaReproduciendo = true;
                    // Solo actualizar si existe el icono (añadido en index.html)
                    if (iconoMusica) iconoMusica.innerText = 'pause';
                    primeraInteraccion = true;
                    // Solo intentar una vez
                    document.body.removeEventListener('click', this); 
                })
                .catch(error => {
                    console.warn("Autoplay bloqueado. El usuario debe pulsar el botón de música.", error);
                    musicaReproduciendo = false;
                    // Solo actualizar si existe el icono (añadido en index.html)
                    if (iconoMusica) iconoMusica.innerText = 'play_arrow';
                    primeraInteraccion = true; 
                });
        }
    }, { once: true });


    // Listener para el botón de música
    controlMusica.addEventListener('click', (event) => {
        // Marcamos la interacción para asegurar el intento de reproducción
        primeraInteraccion = true; 
        
        if (musicaReproduciendo) {
            musicaFondo.pause();
            if (iconoMusica) iconoMusica.innerText = 'play_arrow';
        } else {
            musicaFondo.play().catch(error => {
                console.error("No se pudo reproducir la música:", error);
            });
            if (iconoMusica) iconoMusica.innerText = 'pause';
        }
        musicaReproduciendo = !musicaReproduciendo;
        event.stopPropagation(); // Evita que se propague al body si ya se activó la primera interacción
    });


    // ----------------------------------------------------
    // 4. CARRUSEL DE IMÁGENES
    // ----------------------------------------------------
    const slider = document.getElementById('carrusel-slider');
    const slides = document.querySelectorAll('.carrusel-slide');
    if (slider && slides.length > 0) {
        const totalSlides = slides.length;
        let indiceActual = 0;

        // Función para mover el carrusel
        function moverSlider() {
            // El desplazamiento es el 100% / número total de slides * índice actual
            const desplazamiento = -indiceActual * (100 / totalSlides);
            slider.style.transform = `translateX(${desplazamiento}%)`;
        }

        // Función para avanzar al siguiente slide
        function slideSiguiente() {
            indiceActual = (indiceActual + 1) % totalSlides;
            moverSlider();
        }

        // Iniciar el carrusel para que cambie automáticamente
        setInterval(slideSiguiente, 4000); // Cambia cada 4 segundos
    }


    // ----------------------------------------------------
    // 5. ANIMACIONES AL HACER SCROLL (Intersection Observer)
    // ----------------------------------------------------
    // Se mantiene la lógica del Intersection Observer para un scroll suave de las animaciones
    const elementosAnimables = document.querySelectorAll('.fade-in-slide-up, .fade-in-delay-0-1, .fade-in-delay-0-3, .fade-in-delay-0-4, .fade-in-delay-0-5, .pop-in-delay-0-5, .slide-in-left');
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Aplicamos las clases de animación. 
                target.style.animationPlayState = 'running';
                
                // Una vez que se anima, dejamos de observarlo 
                observer.unobserve(target);
            }
        });
    };

    const observerOptions = {
        root: null, 
        rootMargin: '0px 0px -100px 0px', 
        threshold: 0.1 
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    elementosAnimables.forEach(elemento => {
        elemento.style.animationPlayState = 'paused';
        observer.observe(elemento);
    });

});