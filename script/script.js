document.addEventListener('DOMContentLoaded', () => {

    const datos = {
        nombre: '',
        telefono: '',
        correo: '',
        mensaje: ''
    };

    const nombre = document.querySelector('#nombre');
    const telefono = document.querySelector('#telefono');
    const correo = document.querySelector('#correo');
    const mensaje = document.querySelector('#mensaje');

    const formulario = document.querySelector('#formulario');

    nombre.addEventListener('blur', leertTexto);
    telefono.addEventListener('blur', leertTexto);
    correo.addEventListener('blur', leertTexto);
    mensaje.addEventListener('blur', leertTexto);

    
    formulario.addEventListener('submit', function(evento){
        evento.preventDefault();

        const { nombre, telefono, correo, mensaje} = datos;

        if (nombre === '' || correo === '' || mensaje === ''){
            mostrarAlerta('Tu nombre, mail y mensaje son obligatorios', true);
            return; //cortar ejecucion del codigo
        };

        mostrarAlerta('enviado correctamente, muchas gracias!')
    });


    function leertTexto(e){
        datos[e.target.id] = e.target.value;
    };


    function mostrarAlerta(mensaje, error = null){
        const alerta = document.createElement('P');
        alerta.textContent = mensaje;

        if (error){
            alerta.classList.add('error');
        } else {
            alerta.classList.add('exito');
        };

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    };
});