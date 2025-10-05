import { useEffect } from 'react';
import { useCurrentEntreprise } from './useCurrentEntreprise';

export const useEntrepriseColors = () => {
  const { entreprise } = useCurrentEntreprise();

  useEffect(() => {
    if (entreprise) {
      const root = document.documentElement;
      
      // Définir les variables CSS personnalisées
      root.style.setProperty('--primary-color', entreprise.couleurPrimaire);
      root.style.setProperty('--secondary-color', entreprise.couleurSecondaire);
      root.style.setProperty('--primary-color-hover', adjustBrightness(entreprise.couleurPrimaire, -20));
      root.style.setProperty('--secondary-color-hover', adjustBrightness(entreprise.couleurSecondaire, -20));
    }
  }, [entreprise]);

  return { entreprise };
};

// Fonction utilitaire pour ajuster la luminosité d'une couleur hexadécimale
function adjustBrightness(hex: string, percent: number) {
  // Convertir hex en RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Ajuster la luminosité
  const adjustedR = Math.max(0, Math.min(255, r + (r * percent) / 100));
  const adjustedG = Math.max(0, Math.min(255, g + (g * percent) / 100));
  const adjustedB = Math.max(0, Math.min(255, b + (b * percent) / 100));

  // Convertir en hex
  const rr = Math.round(adjustedR).toString(16).padStart(2, '0');
  const gg = Math.round(adjustedG).toString(16).padStart(2, '0');
  const bb = Math.round(adjustedB).toString(16).padStart(2, '0');

  return `#${rr}${gg}${bb}`;
}