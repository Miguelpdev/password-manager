// src/components/YourPasswords.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import PasswordModal from "./PasswordModal";

const YourPasswords = ({ token }) => {
  const [passwords, setPasswords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isVerified) {
      axios
        .get("http://127.0.0.1:5000/passwords", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setPasswords(response.data);
        })
        .catch((error) => {
          console.error("Error fetching passwords", error);
        });
    }
  }, [isVerified, token]);

  const handleVerify = (password) => {
    // Aquí puedes agregar lógica adicional para verificar la contraseña
    if (password === "miguel") {
      setIsVerified(true);
      setIsModalOpen(false);
    } else {
      alert("Incorrect password");
    }
  };

  const handleCopy = (password) => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        alert("Password copied to clipboard");
      })
      .catch((err) => {
        console.error("Error copying password", err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Your Passwords
        </h2>
        <button
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => setIsModalOpen(true)}
        >
          Get Passwords
        </button>
        <PasswordModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onVerify={handleVerify}
        />
        {isVerified && (
          <ul className="mt-6 space-y-4">
            {passwords.map((pwd, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <span className="text-gray-700">
                  Service: {pwd.service} - Password: {pwd.password}
                </span>
                <button
                  className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => handleCopy(pwd.password)}
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default YourPasswords;
