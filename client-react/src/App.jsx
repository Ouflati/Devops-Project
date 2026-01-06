import { useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AuthApp from "./AuthApp";
import CalendarPage from "./features/calendar/CalendarPage";

import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash || "#/auth");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#/auth");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const page = useMemo(() => {
    if (hash.startsWith("#/calendar")) return "calendar";
    return "auth";
  }, [hash]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App" style={{ minHeight: "100vh" }}>
        {/* petite barre de nav (optionnel mais pratique pour la démo) */}
        <div style={{ padding: 12, display: "flex", gap: 8 }}>
          <a href="#/auth">Auth</a>
          <a href="#/calendar">Calendar</a>
        </div>

        {page === "calendar" ? <CalendarPage /> : <AuthApp />}

        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  );
}
