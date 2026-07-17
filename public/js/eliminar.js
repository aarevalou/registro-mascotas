const api = axios.create({ baseURL: "/api/mascotas" });

document.querySelector("tbody").addEventListener("click", async (event) => {
  const boton = event.target.closest("[data-eliminar-nombre]");
  if (!boton) return;

  const nombre = boton.getAttribute("data-eliminar-nombre");
  if (!confirm(`¿Eliminar la mascota "${nombre}"?`)) return;

  try {
    await api.delete("/", { params: { nombre } });
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
});
