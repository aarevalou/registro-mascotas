const api = axios.create({ baseURL: "/api/mascotas" });

document
  .getElementById("formMascota")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const rut = document.getElementById("rut").value.trim();

    try {
      const respuesta = await api.post("/", { nombre, rut });

      if (respuesta.data.exito) {
        window.location.href = "/mascotas";
        return;
      }

      alert(respuesta.data.mensaje || "No se pudo registrar la mascota.");
    } catch (error) {
      alert("Ocurrió un error inesperado.");
    }
  });
