
const nombre = document.querySelector('#nombre');

nombre.addEventListener('blur', e => {
        const name = e.target.value;

        if (name === "") {
            console.log('campo vacio');
        } else {
            console.log(`Algo se escribió`);
        }
});