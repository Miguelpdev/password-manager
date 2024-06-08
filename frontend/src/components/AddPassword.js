// src/components/AddPassword.js
import React, { useState } from "react";
import axios from "axios";

const AddPassword = ({ token }) => {
  const [service, setService] = useState("");
  const [servicePassword, setServicePassword] = useState("");

  const addPassword = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/passwords",
        { service, password: servicePassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password added successfully");
      setService("");
      setServicePassword("");
    } catch (error) {
      alert("Error adding password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Add Password
        </h2>
        <input
          type="text"
          placeholder="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={servicePassword}
          onChange={(e) => setServicePassword(e.target.value)}
          className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={addPassword}
        >
          Add Password
        </button>
      </div>
    </div>
  );
};

export default AddPassword;
