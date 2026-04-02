import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

function CatIllustration() {
  return (
    <div className="relative mx-auto hidden h-[250px] w-[170px] xl:block">
      <div
        className="absolute left-1/2 top-8 h-44 w-36 -translate-x-1/2 rounded-[36px]"
        style={{
          background: "linear-gradient(180deg, #ffd8a8 0%, #f4b96e 100%)",
          boxShadow: "0 14px 24px rgba(120, 74, 22, 0.16)",
        }}
      />

      <div
        className="absolute left-[34px] top-0 h-16 w-16 rotate-[-18deg]"
        style={{
          background: "linear-gradient(180deg, #ffc98d 0%, #eda95e 100%)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          borderRadius: "14px",
        }}
      />
      <div
        className="absolute right-[34px] top-0 h-16 w-16 rotate-[18deg]"
        style={{
          background: "linear-gradient(180deg, #ffc98d 0%, #eda95e 100%)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          borderRadius: "14px",
        }}
      />

      <div
        className="absolute left-[56px] top-[78px] h-3.5 w-3.5 rounded-full"
        style={{ background: "#6f4322" }}
      />
      <div
        className="absolute right-[56px] top-[78px] h-3.5 w-3.5 rounded-full"
        style={{ background: "#6f4322" }}
      />

      <div
        className="absolute left-1/2 top-[102px] h-3.5 w-4.5 -translate-x-1/2 rounded-full"
        style={{ background: "#9d6233" }}
      />
      <div
        className="absolute left-1/2 top-[118px] h-5 w-7 -translate-x-1/2 rounded-b-full"
        style={{
          borderBottom: "3px solid #9d6233",
          borderLeft: "3px solid transparent",
          borderRight: "3px solid transparent",
        }}
      />

      <div
        className="absolute left-[18px] top-[102px] h-[2px] w-12 rotate-[8deg]"
        style={{ background: "#9d6233" }}
      />
      <div
        className="absolute left-[18px] top-[116px] h-[2px] w-12"
        style={{ background: "#9d6233" }}
      />
      <div
        className="absolute left-[18px] top-[130px] h-[2px] w-12 rotate-[-8deg]"
        style={{ background: "#9d6233" }}
      />

      <div
        className="absolute right-[18px] top-[102px] h-[2px] w-12 rotate-[-8deg]"
        style={{ background: "#9d6233" }}
      />
      <div
        className="absolute right-[18px] top-[116px] h-[2px] w-12"
        style={{ background: "#9d6233" }}
      />
      <div
        className="absolute right-[18px] top-[130px] h-[2px] w-12 rotate-[8deg]"
        style={{ background: "#9d6233" }}
      />

      <div
        className="absolute left-1/2 top-[170px] h-12 w-24 -translate-x-1/2 rounded-[999px]"
        style={{
          background: "linear-gradient(180deg, #ffe5c5 0%, #ffd5a6 100%)",
        }}
      />

      <div
        className="absolute bottom-6 left-[18px] h-16 w-16 rounded-full"
        style={{
          background: "linear-gradient(180deg, #ffd8a8 0%, #f1b464 100%)",
          boxShadow: "0 6px 14px rgba(120, 74, 22, 0.1)",
        }}
      />
      <div
        className="absolute bottom-6 right-[18px] h-16 w-16 rounded-full"
        style={{
          background: "linear-gradient(180deg, #ffd8a8 0%, #f1b464 100%)",
          boxShadow: "0 6px 14px rgba(120, 74, 22, 0.1)",
        }}
      />

      <div
        className="absolute right-0 top-10 rotate-[12deg] rounded-full px-3 py-1 text-[11px] font-bold"
        style={{
          background: "#fff7d6",
          color: "#8a641a",
          boxShadow: "0 8px 14px rgba(0,0,0,0.08)",
        }}
      >
        meow ✨
      </div>
    </div>
  );
}

function NotebookIllustration() {
  return (
    <div className="relative mx-auto hidden h-[250px] w-[170px] xl:block">
      <div
        className="absolute left-1/2 top-4 h-[205px] w-[138px] -translate-x-1/2 rotate-[6deg] rounded-[22px]"
        style={{
          background: "linear-gradient(180deg, #fefefe 0%, #f8f2ea 100%)",
          border: "2px solid #d9c8b6",
          boxShadow: "0 16px 26px rgba(0,0,0,0.1)",
        }}
      >
        <div
          className="absolute left-4 top-0 h-full w-[9px] rounded-full"
          style={{ background: "#f3d8d8" }}
        />
        <div className="absolute left-8 top-8 right-5 h-[2px]" style={{ background: "#eadfd3" }} />
        <div className="absolute left-8 top-16 right-5 h-[2px]" style={{ background: "#eadfd3" }} />
        <div className="absolute left-8 top-24 right-5 h-[2px]" style={{ background: "#eadfd3" }} />
        <div className="absolute left-8 top-32 right-5 h-[2px]" style={{ background: "#eadfd3" }} />

        <div
          className="absolute right-4 top-10 rounded-full px-2.5 py-1 text-[10px] font-bold"
          style={{ background: "#ffe8f0", color: "#b24c73" }}
        >
          study plan
        </div>

        <div className="absolute left-9 top-20 text-[12px]" style={{ color: "#826b55" }}>
          ✓ Arrays
        </div>
        <div className="absolute left-9 top-28 text-[12px]" style={{ color: "#826b55" }}>
          ✓ Binary Search
        </div>
      </div>

      <div
        className="absolute left-8 top-[170px] h-16 w-16 rotate-[-18deg] rounded-[16px]"
        style={{
          background: "linear-gradient(180deg, #ffd8e7 0%, #f6acc5 100%)",
          boxShadow: "0 10px 16px rgba(0,0,0,0.08)",
        }}
      />
      <div
        className="absolute left-[74px] top-[174px] h-3 w-12 rotate-[20deg] rounded-full"
        style={{ background: "#ffd76b" }}
      />
    </div>
  );
}

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
    <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-4 xl:grid xl:grid-cols-[160px_minmax(360px,430px)_160px]">
      <CatIllustration />

      <div
        className="paper-card mx-auto w-full max-w-md rounded-[28px] p-6 sm:p-7"
        style={{
          background: "var(--card)",
          boxShadow: "0 14px 30px rgba(0,0,0,0.06)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="text-center">
          <div
            className="mx-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{
              background: "#fff1e6",
              color: "#b56b2f",
              border: "1px solid #f2d3b8",
            }}
          >
            <span>🌸</span>
            <span>Create your study space</span>
          </div>

          <h1 className="display-serif mt-4 text-3xl font-bold">Register</h1>

          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Start your cute little Blind 75 journey and keep your progress tidy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            placeholder="Name"
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Email"
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm"
            style={{
              background: "var(--ink)",
              color: "var(--bg)",
              borderColor: "var(--ink)",
            }}
          >
            Register
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-[13px] font-medium"
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

        <p className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-2">
            Login
          </Link>
        </p>
      </div>

      <NotebookIllustration />
    </div>
  );
}

export default RegisterPage;