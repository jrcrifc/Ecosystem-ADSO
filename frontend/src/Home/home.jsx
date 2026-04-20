import React from "react";

const Home = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "#f0fdf4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* HERO */}
      <div
        style={{
          width: "100%",
          height: "60vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.5)",
            padding: "30px",
            borderRadius: "20px",
          }}
        >
          <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
            🌍 Cuidemos el Planeta
          </h1>
          <p style={{ fontSize: "18px" }}>
            Juntos podemos proteger el medio ambiente
          </p>
        </div>
      </div>

      {/* SECCIÓN IMÁGENES */}
      <div
        style={{
          width: "90%",
          marginTop: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          alt="Bosque"
          style={imgStyle}
        />
        <img
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e"
          alt="Naturaleza"
          style={imgStyle}
        />
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Océano"
          style={imgStyle}
        />
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
          alt="Árboles"
          style={imgStyle}
        />
      </div>

      {/* TEXTO */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          maxWidth: "800px",
          textAlign: "center",
          color: "#14532d",
        }}
      >
        <h2>🌱 Nuestro Compromiso</h2>
        <p>
          Promovemos el cuidado del medio ambiente a través de la educación,
          la conciencia ecológica y acciones sostenibles. Cada pequeño cambio
          cuenta para proteger nuestro planeta.
        </p>
      </div>
    </div>
  );
};

const imgStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "15px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
};

export default Home;