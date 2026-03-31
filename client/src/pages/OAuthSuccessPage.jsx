import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

function OAuthSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    const run = async () => {
      const token = searchParams.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        localStorage.setItem("token", token);
        await fetchMe(token);
        navigate("/");
      } catch {
        navigate("/login");
      }
    };

    run();
  }, [navigate, searchParams, fetchMe]);

  return <div className="p-6 text-sm">Signing you in...</div>;
}

export default OAuthSuccessPage;