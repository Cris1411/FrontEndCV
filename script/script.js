document.addEventListener('DOMContentLoaded', function() {
    // Navegador
    const navegador = document.querySelector('.navegador');
    let lastScroll = 0;
    let scrollTimeout;

    // Optimización del efecto de scroll usando requestAnimationFrame
    function handleScroll() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(() => {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 100) {
                navegador.classList.add('scrolled');
            } else {
                navegador.classList.remove('scrolled');
            }

            // Actualizar enlace activo
            updateActiveLink(currentScroll);
            
            lastScroll = currentScroll;
        });
    }

    // Efecto de scroll en el navegador con throttling
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Función para actualizar el enlace activo
    function updateActiveLink(currentScroll) {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (currentScroll >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.navegador_obj').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Animación de scroll suave mejorada
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Actualizar enlace activo
                document.querySelectorAll('.navegador_obj').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');

                // Actualizar URL sin recargar la página
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });

    // Formulario de contacto con validación mejorada
    const formulario = document.querySelector('.formulario-contacto');
    
    if (formulario) {
        const inputs = formulario.querySelectorAll('input, textarea');
        let formTimeout;

        // Validación en tiempo real con debounce
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (formTimeout) {
                    clearTimeout(formTimeout);
                }
                formTimeout = setTimeout(() => {
                    validarCampo(this);
                }, 300);
            });

            // Validación al perder el foco
            input.addEventListener('blur', function() {
                validarCampo(this);
            });
        });

        formulario.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validación de todos los campos
            let isValid = true;
            inputs.forEach(input => {
                if (!validarCampo(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                mostrarMensaje('Por favor complete correctamente todos los campos', 'error');
                return;
            }

            // Simulación de envío con feedback visual
            try {
                const submitButton = formulario.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
                mostrarMensaje('Enviando mensaje...', 'info');
                
                await simularEnvio();
                
                mostrarMensaje('¡Mensaje enviado con éxito!', 'exito');
                formulario.reset();
                
                // Restaurar botón
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            } catch (error) {
                mostrarMensaje('Error al enviar el mensaje. Por favor intente nuevamente.', 'error');
            }
        });
    }

    // Animación de elementos al hacer scroll con Intersection Observer
    const elementos = document.querySelectorAll('.trabajo, .conocimientos li, .titulo');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: dejar de observar después de la primera vez
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementos.forEach(elemento => {
        observer.observe(elemento);
    });

    // Funciones auxiliares mejoradas
    function validarCampo(campo) {
        const valor = campo.value.trim();
        let isValid = true;
        let mensaje = '';

        switch(campo.type) {
            case 'email':
                if (!validarEmail(valor)) {
                    isValid = false;
                    mensaje = 'Ingrese un correo electrónico válido';
                }
                break;
            case 'text':
                if (valor.length < 2) {
                    isValid = false;
                    mensaje = 'Este campo es requerido';
                }
                break;
            case 'textarea':
                if (valor.length < 10) {
                    isValid = false;
                    mensaje = 'El mensaje debe tener al menos 10 caracteres';
                }
                break;
        }

        // Actualizar clases y mensaje de error
        if (!isValid) {
            campo.classList.add('error');
            campo.classList.remove('exito');
            mostrarErrorCampo(campo, mensaje);
        } else {
            campo.classList.remove('error');
            campo.classList.add('exito');
            limpiarErrorCampo(campo);
        }

        return isValid;
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function mostrarErrorCampo(campo, mensaje) {
        limpiarErrorCampo(campo);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-mensaje';
        errorDiv.textContent = mensaje;
        campo.parentNode.appendChild(errorDiv);
    }

    function limpiarErrorCampo(campo) {
        const errorDiv = campo.parentNode.querySelector('.error-mensaje');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    function mostrarMensaje(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.className = `mensaje ${tipo}`;
        divMensaje.textContent = mensaje;
        
        const contenedor = document.querySelector('.formulario-contacto');
        contenedor.insertBefore(divMensaje, contenedor.firstChild);
        
        // Animación de entrada
        requestAnimationFrame(() => {
            divMensaje.style.opacity = '1';
            divMensaje.style.transform = 'translateY(0)';
        });
        
        // Eliminar mensaje después de 3 segundos
        setTimeout(() => {
            divMensaje.style.opacity = '0';
            divMensaje.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                divMensaje.remove();
            }, 300);
        }, 3000);
    }

    function simularEnvio() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }
});