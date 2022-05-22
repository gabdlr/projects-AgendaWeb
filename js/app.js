const formularioContactos = document.querySelector('#contacto'),
    listadoContactos = document.querySelector('#listado-contactos tbody');
    inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
    //Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    //Listener para el boton eliminar
    listadoContactos?.addEventListener('click', eliminarContacto);

    //Buscador
    inputBuscador?.addEventListener('input', buscarContactos);
    //Numero de contactos
    if(inputBuscador){
        numeroContactos();
    }
}

function leerFormulario(e) {
    //Previene el default (mandar el action #)
    //Se utiliza siempre para manipular formularios ajax y js
    //Mas o menos
    e.preventDefault();

    //Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value,
        accion = document.querySelector('#accion').value;

    if (nombre === '' || empresa === '' || telefono === '') {
        //2 parametros: texto y clase
        mostrarNotificacion('Todos los campos son obligatorios', 'error')
    } else {
        //Pasa la validacion, crear llamado a AJAX
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        if (accion === 'crear') {
            //creamos un nuevo elemento
            insertarBD(infoContacto);
        } else {
            //editar el contacto
            //leer el id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }

}

/**Inserta en la BD via AJAX */
function insertarBD(datos) {
    //Llamado a ajax

    //crear el objeto
    const xhr = new XMLHttpRequest();
    //abrir la conecxion
    xhr.open('POST', 'inc/modelos/modelo-contacto.php', true);
    //pasar los datos
    xhr.onload = function() {
            if (this.status === 200) {
                //Leemos la respuesta de PHP
                const respuesta = JSON.parse(xhr.responseText);
                if(!respuesta.error){
                    //Inserta un nuevo elemento a la tabla
                    const nuevoContacto = document.createElement('tr');
                    nuevoContacto.innerHTML = `
                    <td>${respuesta.datos.nombre}</td>
                    <td>${respuesta.datos.empresa}</td>
                    <td>${respuesta.datos.telefono}</td>
                    `;
                    //Crear contenedor para los botones
                    const contenedorAcciones = document.createElement('td');

                    //Crear el icono de editar
                    const iconoEditar = document.createElement('i');
                    iconoEditar.classList.add('fas', 'fa-pen-square');
                    //Crea el enlace para editar
                    const btnEditar = document.createElement('a');
                    btnEditar.appendChild(iconoEditar);
                    btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
                    btnEditar.classList.add('btn', 'btn-editar');
                    //Agregarlo al padre
                    contenedorAcciones.appendChild(btnEditar);

                    //Crear el icono de eliminar
                    //Crea el <i></i>
                    const iconoEliminar = document.createElement('i');
                    //Le da estilos al i .fas .fa-trash-alt
                    iconoEliminar.classList.add('fas', 'fa-trash-alt');
                    //Crea el boton de eliminar
                    const btnEliminar = document.createElement('button');
                    btnEliminar.appendChild(iconoEliminar);
                    //Le da atributos al boton 
                    btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
                    btnEliminar.classList.add('btn', 'btn-borrar');
                    //Agregarlo al padre
                    contenedorAcciones.appendChild(btnEliminar);

                    //Agregarlo al tr
                    nuevoContacto.appendChild(contenedorAcciones);

                    //Agregarlo con los contactos
                    listadoContactos.appendChild(nuevoContacto);

                    //Resetear el formulario
                    document.querySelector('form').reset();

                    //Mostrar notificaciones
                    mostrarNotificacion('Contacto creado correctamente', 'correcto');

                    //Actualizar el numero de contactos
                    numeroContactos();
                }else{
                    if(respuesta.error === 'is_not_number'){
                        mostrarNotificacion('>:(', 'error');
                    }else{
                        mostrarNotificacion('Hubo un error', 'error');
                    }
                }
                
            }
        }
        //enviar los datos
    xhr.send(datos);
}

function actualizarRegistro(datos) {
    //Crear el objeto
    const xhr = new XMLHttpRequest();
    //Abrir la conecxion
    xhr.open('POST', 'inc/modelos/modelo-contacto.php', true);
    //Leer la respuesta
    xhr.onload = function() {
            if (this.status === 200) {
                const respuesta = JSON.parse(xhr.responseText);
                if (respuesta.respuesta === 'correcto') {
                    //Mostrar notificacion de correcto
                    mostrarNotificacion('Contacto editado correctamente', 'correcto');
                } else {
                    if(respuesta.error === 'is_not_number'){
                        mostrarNotificacion('>:(', 'error');
                    }else{
                        mostrarNotificacion('Hubo un error', 'error');
                    }
                }
            }
            //Después de 3s redireccionar
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 1000);
        }
        //Enviar la peticion
    xhr.send(datos);
}

function eliminarContacto(e) {
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        //Tomar el id
        const id = e.target.parentElement.getAttribute('data-id');
        //Preguntar al usuario
        const respuesta = confirm('Estas seguro');
        if (respuesta) {
            //lamado a ajax
            //crear el objeto
            const xhr = new XMLHttpRequest();

            //abrir la conecxion
            xhr.open('GET', `inc/modelos/modelo-contacto.php?id=${id}&accion=borrar`, true);

            //leer la respuesta
            xhr.onload = function() {
                    if (this.status === 200) {
                        const resultado = JSON.parse(xhr.responseText);

                        if (resultado.respuesta === 'correcto') {
                            //Eliminar el registro del DOM

                            //Mostrar notificacion
                            mostrarNotificacion('Contacto eliminado', 'correcto');
                            e.target.parentElement.parentElement.parentElement.remove();

                            //Actualizar el numero de contactos
                            numeroContactos();
                        } else {
                            //Mostramos una notificacion
                            mostrarNotificacion('Hubo un error', 'error');
                        }
                    }
                }
                //enviar la peticion
            xhr.send();

        } else {

        }
    }
}

function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    //formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    //Ocultar y mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add('visible');

        setTimeout(() => {
            notificacion.classList.remove('visible');

            setTimeout(() => {
                notificacion.remove();
            }, 500)
        }, 3000)
    }, 100)
}

function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),
        registros = document.querySelectorAll('tbody tr');

    registros.forEach(registro => {
        registro.style.display = 'none';
        if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            registro.style.display = 'table-row';
        }
        numeroContactos();
    })
}

function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;

    totalContactos.forEach(contacto => {
        if (contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });

    contenedorNumero.textContent = total;
}