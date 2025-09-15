import { useContext } from "react";
import { LoginContext } from "./LoginContext";

export function useLogin() {
  const context = useContext(LoginContext);
  if (!context) throw new Error("this component outside provider");
  return context;
}
