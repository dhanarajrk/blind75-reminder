import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function LoginPage() {
    const login = useAuthStore((s) => s.login);
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form);
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="paper-card mx-auto max-w-md p-6">
            <h1 className="display-serif text-2xl font-bold">Login</h1>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
                    Login
                </button>

                <p className="text-sm mt-3" style={{ color: "var(--muted)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" className="underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;