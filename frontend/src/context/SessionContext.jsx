import { createContext, useContext, useState } from "react";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sessionExpired, setSessionExpired] = useState(false);

  return (
    <SessionContext.Provider
      value={{
        sessionExpired,
        setSessionExpired,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
