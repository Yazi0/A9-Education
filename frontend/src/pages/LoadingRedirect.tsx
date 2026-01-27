import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const LoadingRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 1500); // loading duration

    return () => clearTimeout(timer);
  }, [navigate]);

  return <Loading />;
};

export default LoadingRedirect;
