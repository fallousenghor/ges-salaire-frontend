export interface EntrepriseColorContextType {
    primaryColor: string;
    secondaryColor: string;
    updateColors: (primaryColor: string, secondaryColor: string) => void;
}