"use client";
import React, { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
        setError("Las contraseñas no coinciden");
        return;
    }
    setError(null);
    setLoading(true);
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: `${nombre} ${apellido}` });
        await setDoc(doc(db, "users", cred.user.uid), {
            nombre,
            apellido,
            email,
            createdAt: Date.now(),
        });
        router.push("/SOSA/login");
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-800 border-2 border-blue-500 rounded-xl p-8 space-y-4"
      >
        <h2 className="text-2xl text-white text-center font-bold mb-4">
          Regístrate
        </h2>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <div>
          <label className="block text-gray-300 mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-400 text-white py-2 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-400 text-white py-2 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-400 text-white py-2 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-400 text-white py-2 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1">
            Verificar Contraseña
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full bg-transparent border-b border-gray-600 focus:border-blue-400 text-white py-2 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black rounded-full h-12 hover:bg-gray-200 transition"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link href="/SOSA/login" className="text-blue-400 hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
