const { writeFileSync, readFileSync } = require("fs");
const Tarea = require("./Tarea");
const path = require("path");
require('colors');


const leerJSON = () =>
  JSON.parse(readFileSync(path.join(__dirname, "tareas.json"), "utf-8"));
const escribirJSON = (tareas) =>
  writeFileSync(
    path.join(__dirname, "tareas.json"),
    JSON.stringify(tareas, null, 3),
    "utf-8"
  );

module.exports = {
  tareas: leerJSON(),
  listar: function (tareas = this.tareas) {
    tareas.forEach(({ titulo, estado }, index) => {
      let estadoColoreado =
        estado === 'Pendiente'
          ? estado.yellow // Naranja
          : estado === 'En progreso'
          ? estado.green // Azul celeste
          : estado === 'Terminada'
          ? estado.magenta // Morado claro
          : estado;
      console.log(`${index + 1} - Tarea: ${titulo} ---> ${estadoColoreado}`);
    });
  },
  filtrarPorEstado: function (estado) {
    const estadoFiltrado = estado.toLowerCase();
    const tareasFiltradas = this.tareas.filter(
      (tarea) => tarea.estado.toLowerCase() === estadoFiltrado
    );
    this.listar(tareasFiltradas);
  },
  agregar: function (titulo, estado = "pendiente") {
    const tareas = this.tareas;
    let tarea = new Tarea(titulo);
    tarea.estado = estado; // Asignar el valor del parámetro estado a la propiedad estado de la tarea
    tareas.push(tarea);
    escribirJSON(tareas);
    return `Se agregó "${titulo}" correctamente.`;
  },
  eliminar: function (titulo) {
    const tareas = this.tareas;
    const index = tareas.findIndex((tarea) => tarea.titulo === titulo);
    if (index !== -1) {
      tareas.splice(index, 1);
      escribirJSON(tareas);
      return `Se eliminó ${titulo} correctamente`;
    } else {
      return `No se encontró la tarea ${titulo}`;
    }
  },
  editarEstado: function (titulo, nuevoEstado) {
    const tareas = this.tareas;
    const tarea = tareas.find((t) => t.titulo === titulo);
    if (tarea) {
      tarea.estado = nuevoEstado;
      escribirJSON(tareas);
      return `Se editó el estado de ${titulo} a ${nuevoEstado}`;
    } else {
      return `No se encontró la tarea ${titulo}`;
    }
  }
};