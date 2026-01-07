import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NotificationFeed from "./components/notifications/NotificationFeed";
import AuthApp from "./AuthApp";
import './App.css';
import { useState } from "react";

const queryClient = new QueryClient();

export default function App() {
  const [token, setToken] = useState("");
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <AuthApp onToken={setToken} />
        <NotificationFeed token={token} />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  );
}
