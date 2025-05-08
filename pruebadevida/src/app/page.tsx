"use client";
import React, { useEffect, useState } from "react";

const gestures = [
  "Sonríe",
  "Parpadea",
  "Gira la cabeza",
  "Abre la boca",
];

export default function Home() {
  const [currentGesture, setCurrentGesture] = useState<string>("");
  const [result, setResult] = useState<"Comply" | "Fail" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Llamar al backend Python para inicializar cámara
    fetch("/api/open-camera").catch(console.error);
    pickGesture();
  }, []);

  function pickGesture() {
    const random = gestures[Math.floor(Math.random() * gestures.length)];
    setCurrentGesture(random);
    setResult(null);
  }

  async function handleValidate() {
    setLoading(true);
    try {
      const res = await fetch("/api/validate-gesture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gesture: currentGesture }),
      });
      const data = await res.json();
      setResult(data.result === "Comply" ? "Comply" : "Fail");
    } catch (err) {
      console.error(err);
      setResult("Fail");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="bg-gray-900 shadow p-4">
        <h1 className="text-2xl font-bold text-center">Herramienta de Prueba de Vida</h1>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-sm">
          <p className="text-lg mb-4 text-center">Realiza el siguiente gesto:</p>
          <div className="text-3xl font-semibold text-center mb-6">{currentGesture}</div>

          {/* El video se maneja en Python; omitido aquí */}

          <div className="flex gap-4">
            <button
              onClick={handleValidate}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 rounded"
            >
              {loading ? "Validando..." : "Validar gesto"}
            </button>
            <button
              onClick={pickGesture}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 rounded"
            >
              Nuevo gesto
            </button>
          </div>

          {result && (
            <div
              className={`mt-4 text-center text-xl font-bold ${
                result === "Comply" ? "text-green-400" : "text-red-400"
              }`}
            >
              {result === "Comply" ? "¡Prueba exitosa!" : "No cumple con la prueba"}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-center py-4">
        <small className="text-gray-500">© {new Date().getFullYear()} Prueba de Vida</small>
      </footer>
    </div>
  );
}
