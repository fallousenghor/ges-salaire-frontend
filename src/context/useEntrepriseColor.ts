import { useContext } from "react";
import { EntrepriseColorContext } from "./EntrepriseColorContext";

export const useEntrepriseColor = () => {
  const ctx = useContext(EntrepriseColorContext);
  if (!ctx) throw new Error("useEntrepriseColor must be used within EntrepriseColorProvider");
  return ctx;
};
