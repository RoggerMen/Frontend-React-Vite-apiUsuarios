import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://nodejs-bdrailway-apiusuarios-production.up.railway.app/usuarios"; // tu API local

function App() {
  // LISTA
  const [usuarios, setUsuarios] = useState([]);
  // ESTADOS PARA AGREGAR
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  // ESTADOS PARA EDITAR
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Cargar usuarios
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setUsuarios(data));
  }, []);

  const agregarUsuario = async () => {
    const nuevo = { id, nombre, correo };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    const data = await res.json();
    setUsuarios([...usuarios, data]);
    setId("");
    setNombre("");
    setCorreo("");
  };

  // FUNCION ELIMINAR
  const eliminarUsuario = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  // FUNCION PARA INICIAR LA EDICION
  const iniciarEdicion = (usuario) => {
    setModoEdicion(true);
    setUsuarioEditando(usuario);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
  };

  // FUNCION PARA GUARDAR LOS CAMBIOS(PUT)
  const guardarCambios = async () => {
    const actualizado = { nombre, correo };
    const res = await fetch(`${API_URL}/${usuarioEditando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizado),
    });
    const data = await res.json();

    setUsuarios(usuarios.map((u) => (u.id === data.id ? data : u)));
    setModoEdicion(false);
    setUsuarioEditando(null);
    setNombre("");
    setCorreo("");
  };

  return (
    <main>
      <h1>Usuarios</h1>
      <input
        type="text"
        placeholder="Id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      {modoEdicion ? (
        <button onClick={guardarCambios}>Guardar Cambios</button>
      ) : (
        <button onClick={agregarUsuario}>Agregar Usuario</button>
      )}

      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nombre} - {u.correo}
            <button className="button1" onClick={() => eliminarUsuario(u.id)}>🗑️</button>
            <button className="button2" onClick={() => iniciarEdicion(u)}>✏️</button>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
