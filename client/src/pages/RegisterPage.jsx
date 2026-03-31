import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

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

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
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

            <button
                onClick={handleGoogleLogin}
                className="mt-3 w-full flex items-center justify-center gap-2 border px-3 py-2 text-[13px]"
                style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                    color: "var(--ink)",
                }}
            >
                <svg width="16" height="16" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.68 1.22 9.17 3.6l6.83-6.83C35.64 2.27 30.2 0 24 0 14.62 0 6.44 5.38 2.56 13.22l7.98 6.2C12.28 13.2 17.62 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.1 24.5c0-1.63-.15-3.2-.42-4.72H24v9h12.4c-.54 2.9-2.17 5.36-4.63 7.03l7.19 5.6C43.88 37.2 46.1 31.3 46.1 24.5z" />
                    <path fill="#FBBC05" d="M10.54 28.42A14.5 14.5 0 019.5 24c0-1.53.26-3.01.72-4.42l-7.98-6.2A23.98 23.98 0 000 24c0 3.87.93 7.53 2.56 10.78l7.98-6.36z" />
                    <path fill="#34A853" d="M24 48c6.2 0 11.4-2.05 15.2-5.58l-7.19-5.6c-2 1.34-4.55 2.13-8.01 2.13-6.38 0-11.72-3.7-13.46-8.92l-7.98 6.36C6.44 42.62 14.62 48 24 48z" />
                </svg>
                Continue with Google
            </button>

            <p className="text-sm mt-3" style={{ color: "var(--muted)" }}>
                Already have an account?{" "}
                <Link to="/login" className="underline">
                    Login
                </Link>
            </p>
        </div>
    );
}

export default RegisterPage;