document.addEventListener("DOMContentLoaded", async function () {
    // Cargar cursos en la página de inicio
    if (document.getElementById("cursos")) {
        const respuesta = await fetch(`http://localhost:3000/cursos`);
        const cursos = await respuesta.json();
        document.getElementById("cursos").innerHTML = cursos
            .map(curso => `<li>${curso.nombre} - ${curso.lugar}</li>`)
            .join("");
    }

    // Cargar centros en la página de centros
    if (document.getElementById("centros")) {
        const respuesta = await fetch(`http://localhost:3000/centros`);
        const centros = await respuesta.json();
        document.getElementById("centros").innerHTML = centros
            .map(centro => `<li>${centro.nombre} - ${centro.direccion}</li>`)
            .join("");
    }

    // Cargar alumnos según el curso seleccionado
    if (document.getElementById("seleccionarCurso")) {
        const select = document.getElementById("seleccionarCurso");
        const respuestaCursos = await fetch(`http://localhost:3000/cursos`);
        const cursos = await respuestaCursos.json();
        cursos.forEach(curso => {
            let option = document.createElement("option");
            option.value = curso.id;
            option.textContent = curso.nombre;
            select.appendChild(option);
        });

        select.addEventListener("change", async function () {
            const cursoId = this.value;
            const respuestaAlumnos = await fetch(`http://localhost:3000/alumnos/${cursoId}`);
            const alumnos = await respuestaAlumnos.json();
            document.getElementById("listaAlumnos").innerHTML = alumnos
                .map(a => `<li>${a.nombre} (${a.aprobado ? "Aprobado" : "Reprobado"}) 
                        <button onclick="eliminarAlumno(${a.id})">Eliminar</button></li>`)
                .join("");
        });
    }
    // Función para eliminar un alumno
async function eliminarAlumno(id) {
    await fetch(`http://localhost:3000/alumnos/${id}`, { method: "DELETE" });
    alert("Alumno eliminado");
    location.reload();
}
});


