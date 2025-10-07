import React from 'react';
import { useEntrepriseColors } from '../hooks/useEntrepriseColors';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded } = useEntrepriseColors();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="theme-content">
      <style>
        {`
          .theme-content {
            opacity: 1;
            transition: opacity 0.3s ease-in;
          }

          /* Masquer tout le contenu jusqu'à ce que les couleurs soient chargées */
          .theme-ready {
            opacity: 0;
            transition: opacity 0.3s ease-in;
          }

          /* Afficher le contenu une fois les couleurs chargées */
          .theme-ready.loaded {
            opacity: 1;
          }

          .btn-primary {
            background-color: var(--primary-color);
            color: white;
            transition: background-color 0.3s ease;
          }

          .btn-primary:hover {
            background-color: var(--primary-color-hover);
          }

          .btn-secondary {
            background-color: var(--secondary-color);
            color: white;
            transition: background-color 0.3s ease;
          }

          .btn-secondary:hover {
            background-color: var(--secondary-color-hover);
          }

          .bg-theme-primary {
            background-color: var(--primary-color);
          }

          .bg-theme-secondary {
            background-color: var(--secondary-color);
          }

          .text-theme-primary {
            color: var(--primary-color);
          }

          .text-theme-secondary {
            color: var(--secondary-color);
          }

          .border-theme-primary {
            border-color: var(--primary-color);
          }

          .border-theme-secondary {
            border-color: var(--secondary-color);
          }
        `}
      </style>
      {children}
    </div>
  );
};