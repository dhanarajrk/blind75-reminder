import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="paper-card mx-auto max-w-md p-6">
      <h1 className="display-serif text-2xl font-bold">Register</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          placeholder="Name"
          className="w-full border px-3 py-2"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full border px-3 py-2"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2"
          style={{ background: "var(--surface)", borderColor: "var(--border)" }}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          className="w-full border px-3 py-2"
          style={{ background: "var(--ink)", color: "var(--bg)" }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;