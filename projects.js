const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

export async function getProjectsByUser() {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects`, {
    headers: { "auth-token" : `${token}` }
  });
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
}

export async function getProjectById(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error("Proyecto no encontrado");
  return res.json();
}

export async function createProject(project) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": `${token}`
    },
    body: JSON.stringify(project)
  });
  if (!res.ok) throw new Error("Error al crear proyecto");
  return res.json();
}

export async function updateProject(projectId, updates) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": `${token}`
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error("Error al actualizar");
  return res.json();
}

export async function deleteProject(projectId) {
  const token = localStorage.getItem("authToken");
  const res = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "DELETE",
    headers: { "auth-token": `${token}` }
  });
  if (!res.ok) throw new Error("Error al eliminar");
  return res.json();
}