import React, { useState } from "react";
import TableModal from "./TableModal";

const PasswordTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      service: "Google",
      tiposUsuario: "Admin",
      estado: "Active",
      usuario: "admin",
      password: "password123",
    },
    {
      id: 2,
      service: "Facebook",
      tiposUsuario: "User",
      estado: "Inactive",
      usuario: "user",
      password: "password456",
    },
    // Agrega más datos según sea necesario
  ]);

  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);
  const masterPassword = "masterpassword"; // Contraseña única para todas las entradas

  const handleModalSubmit = (inputPassword) => {
    if (inputPassword === masterPassword) {
      setVisiblePasswords((prevState) => ({
        ...prevState,
        [currentIndex]: !prevState[currentIndex],
      }));
      setIsPasswordEntered(true);
    } else {
      alert("Contraseña incorrecta");
    }
    setIsModalOpen(false);
    setCurrentIndex(null);
  };

  const handleTogglePasswordVisibility = (index) => {
    if (!visiblePasswords[index]) {
      setCurrentIndex(index);
      setIsModalOpen(true);
    } else {
      setVisiblePasswords((prevState) => ({
        ...prevState,
        [index]: false,
      }));
      setIsPasswordEntered(false);
    }
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        alert("Contraseña copiada al portapapeles");
      })
      .catch(() => {
        alert("Error al copiar la contraseña");
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-700 border-green-700";
      case "Inactive":
        return "text-red-700 border-red-700";
      case "Pending":
        return "text-yellow-700 border-yellow-700";
      default:
        return "text-gray-700 border-gray-700";
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Service</th>
            <th className="py-2 px-4 border-b">Tipos Usuario</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Usuario</th>
            <th className="py-2 px-4 border-b">Password</th>
            <th className="py-2 px-4 border-b">Ver</th>
            <th className="py-2 px-4 border-b">Copiar</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.service}</td>
              <td className="py-2 px-4 border-b">{item.tiposUsuario}</td>
              <td className={`py-2 px-4 border-b`}>
                <span
                  className={`px-2 py-1 rounded border ${getStatusColor(
                    item.estado
                  )}`}
                >
                  {item.estado}
                </span>
              </td>
              <td className="py-2 px-4 border-b">{item.usuario}</td>
              <td className="py-2 px-4 border-b">
                {visiblePasswords[item.id] ? item.password : "••••••••"}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleTogglePasswordVisibility(item.id)}
                >
                  {visiblePasswords[item.id] ? "Ocultar" : "Ver"}
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className={`bg-green-500 text-white px-2 py-1 rounded ${
                    !isPasswordEntered || !visiblePasswords[item.id]
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => handleCopyPassword(item.password)}
                  disabled={!isPasswordEntered || !visiblePasswords[item.id]}
                >
                  Copiar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default PasswordTable;
