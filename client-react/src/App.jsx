import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AuthApp from "./AuthApp";
import NotificationFeed from "./components/notifications/NotificationFeed";
import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  const showNotificationsPreview = true; // set false to go back to AuthApp

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App" style={{ padding: 20 }}>
        {showNotificationsPreview ? <NotificationFeed /> : <AuthApp />}
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  );
}

// INJECT TEST TOKEN
if (typeof window !== 'undefined') {
  const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2ODk0NTY3NywiZXhwIjoxNzY5MDMyMDc3fQ.Je72_Ur-SJcpg3AkvPMDdD_dgmMLpcZTZaQDrQkvOOM";
  if (!localStorage.getItem('token')) {
    localStorage.setItem('token', TEST_TOKEN);
  }
}
