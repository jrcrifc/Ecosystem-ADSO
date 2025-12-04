import React from "react";
import EstadoList from "./components/EstadoList";

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">CRUD - estadoxequipo</h1>
      <EstadoList />
    </div>
  );
}
