
        // Datos de los videos y sus títulos
        const videoData = {
            'legislacion': {
                title: 'Legislación y Políticas Ambientales',
                description: 'Conoce las leyes y políticas que regulan la protección ambiental'
            },
            'problematica': {
                title: 'Problemáticas Ambientales',
                description: 'Identifica los principales problemas ambientales actuales'
            },
            'acciones': {
                title: 'Acciones de Cambio',
                description: 'Descubre estrategias para implementar cambios positivos'
            },
            'actividades': {
                title: 'Actividades Didácticas e Interactivas',
                description: 'Participa en ejercicios y actividades de aprendizaje'
            },
            'bibliografia': {
                title: 'Fuentes Bibliográficas',
                description: 'Consulta referencias y recursos adicionales'
            }
        };
        
        // Variables globales
        let currentVideo = null;
        let hoverTimeout = null;
        
        // Efecto de animación al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            const buttonItems = document.querySelectorAll('.button-item');
            buttonItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.6s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 150);
            });
            
            // Configurar eventos de hover para los botones
            setupButtonHoverEvents();
        });
        
        function setupButtonHoverEvents() {
            const buttonItems = document.querySelectorAll('.button-item');
            
            buttonItems.forEach(item => {
                const videoType = item.getAttribute('data-video');
                
                // Evento mouseenter
                item.addEventListener('mouseenter', function() {
                    clearTimeout(hoverTimeout);
                    showVideo(videoType);
                });
                
                // Evento mouseleave
                item.addEventListener('mouseleave', function() {
                    hoverTimeout = setTimeout(() => {
                        hideVideo();
                    }, 300); // Delay para evitar parpadeos
                });
            });
        }
        
        function showVideo(videoType) {
            // Actualizar título y descripción
            const titleElement = document.getElementById('video-title');
            const descriptionElement = document.getElementById('video-description');
            
            if (videoData[videoType]) {
                titleElement.textContent = videoData[videoType].title;
                descriptionElement.textContent = videoData[videoType].description;
            }
            
            // Ocultar placeholder
            const placeholder = document.getElementById('video-content');
            placeholder.classList.remove('active');
            
            // Mostrar video correspondiente
            const videoElement = document.getElementById(`video-${videoType}`);
            if (videoElement) {
                // Pausar video actual si existe
                if (currentVideo && currentVideo !== videoElement) {
                    currentVideo.pause();
                    currentVideo.classList.remove('active');
                }
                
                // Mostrar nuevo video
                videoElement.classList.add('active');
                currentVideo = videoElement;
                
                // Intentar reproducir (algunos navegadores requieren interacción del usuario)
                videoElement.play().catch(e => {
                    console.log('No se pudo reproducir automáticamente:', e);
                });
            }
        }
        
        function hideVideo() {
            // Mostrar placeholder
            const placeholder = document.getElementById('video-content');
            placeholder.classList.add('active');
            
            // Ocultar video actual
            if (currentVideo) {
                currentVideo.pause();
                currentVideo.classList.remove('active');
                currentVideo = null;
            }
            
            // Restaurar título y descripción por defecto
            const titleElement = document.getElementById('video-title');
            const descriptionElement = document.getElementById('video-description');
            titleElement.textContent = 'Selecciona un tema';
            descriptionElement.textContent = 'Pasa el mouse sobre los botones para ver el contenido';
        }
        
        // Efecto hover mejorado para los botones
        document.querySelectorAll('.botoncitos').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            });
        });
        
        // Prevenir que el video se pause cuando el mouse sale del área del video
        document.querySelectorAll('.video-player').forEach(video => {
            video.addEventListener('mouseenter', function() {
                clearTimeout(hoverTimeout);
            });
        });

        // Carrusel horizontal automático y controles manuales
        document.addEventListener('DOMContentLoaded', function() {
            const galeria = document.querySelector('.galeria');
            const cards = Array.from(galeria.querySelectorAll('.card'));
            const carousel = document.querySelector('.galeria-carousel');
            const btnLeft = document.querySelector('.galeria-carousel-btn.left');
            const btnRight = document.querySelector('.galeria-carousel-btn.right');
            galeria.style.display = 'none'; // Oculta la galería original

            // Duplicar las tarjetas para efecto infinito
            cards.forEach(card => carousel.appendChild(card));
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                carousel.appendChild(clone);
            });

            let cardWidth = carousel.children[0].offsetWidth + 24; // 24px = 2*12px margin
            let totalCards = carousel.children.length;
            let position = 0;
            let autoScrollInterval = null;
            let isUserInteracting = false;

            function updateCardWidth() {
                cardWidth = carousel.children[0].offsetWidth + 24;
            }

            function autoScroll() {
                if (!isUserInteracting) {
                    position += 8; // Aumentado a 8 píxeles por paso para mayor velocidad
                    if (position >= cardWidth * (totalCards / 2)) {
                        position = 0;
                    }
                    carousel.style.transform = `translateX(-${position}px)`;
                }
            }

            function startAutoScroll() {
                if (autoScrollInterval) clearInterval(autoScrollInterval);
                autoScrollInterval = setInterval(autoScroll, 80); // Reducido de 100ms a 80ms para mayor velocidad
            }

            function stopAutoScroll() {
                if (autoScrollInterval) clearInterval(autoScrollInterval);
            }

            function moveLeft() {
                isUserInteracting = true;
                position -= cardWidth;
                if (position < 0) {
                    position = cardWidth * (totalCards / 2 - 1);
                }
                carousel.style.transform = `translateX(-${position}px)`;
                setTimeout(() => { isUserInteracting = false; }, 800);
            }

            function moveRight() {
                isUserInteracting = true;
                position += cardWidth;
                if (position >= cardWidth * (totalCards / 2)) {
                    position = 0;
                }
                carousel.style.transform = `translateX(-${position}px)`;
                setTimeout(() => { isUserInteracting = false; }, 800);
            }

            btnLeft.addEventListener('click', moveLeft);
            btnRight.addEventListener('click', moveRight);

            // Pausar auto-scroll solo al pasar el mouse sobre los botones
            [btnLeft, btnRight].forEach(el => {
                el.addEventListener('mouseenter', () => { isUserInteracting = true; });
                el.addEventListener('mouseleave', () => { isUserInteracting = false; });
            });

            window.addEventListener('resize', () => {
                updateCardWidth();
            });

            updateCardWidth();
            startAutoScroll();
        });
    