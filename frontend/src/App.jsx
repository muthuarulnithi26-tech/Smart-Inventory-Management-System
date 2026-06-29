import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { useSession } from "./context/SessionContext";
import { sessionEvent } from "./utils/sessionEvent";
import SessionExpiredDialog from "./components/SessionExpiredDialog";

function App() {
  const { setSessionExpired } = useSession();

  useEffect(() => {
    sessionEvent.subscribe(() => {
      setSessionExpired(true);
    });
  }, []);

  return (
    <>
      <AppRoutes />
      <SessionExpiredDialog />
    </>
  );
}

export default App;
