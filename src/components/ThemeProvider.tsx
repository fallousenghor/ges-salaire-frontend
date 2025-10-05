import React from 'react';
import { useEntrepriseColors } from '../hooks/useEntrepriseColors';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEntrepriseColors();

  return (
    <>
      <style>
        {`
          :root {
            --primary-color: #2563eb;
            --secondary-color: #1e40af;
            --primary-color-hover: #1d4ed8;
            --secondary-color-hover: #1e3a8a;
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
    </>
  );
};