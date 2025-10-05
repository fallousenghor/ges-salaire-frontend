import { createContext } from "react";
import type { EntrepriseColorContextType } from "./EntrepriseColorContextType";

export const EntrepriseColorContext = createContext<EntrepriseColorContextType | undefined>(undefined);
