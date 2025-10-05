import React from "react";
import type { Entreprise } from "../types/entreprise";
import { getLogoUrl } from '../utils/uploads';
import { Building2, Mail, Phone, MapPin, DollarSign, CalendarCheck, BadgeCheck, Palette } from "lucide-react";

interface EntrepriseDetailsProps {
  entreprise: Entreprise;
  onClose: () => void;
}

const EntrepriseDetails: React.FC<EntrepriseDetailsProps> = ({ entreprise, onClose }) => {
  const logoUrl = getLogoUrl(entreprise.logo ?? null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gradient-to-br from-green-50 via-white to-green-100 rounded-2xl shadow-2xl p-0 w-full max-w-2xl relative animate-fade-in border border-green-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold focus:outline-none"
          aria-label="Fermer"
        >
          &times;
        </button>
        <div className="flex flex-col items-center gap-4 py-8 px-6 sm:px-12">
          <div className="relative mb-2">
            <img
              src={logoUrl ?? "/avatar-default.svg"}
              alt={entreprise.nom}
              className="w-32 h-32 rounded-full object-cover border-4 border-green-300 shadow-xl bg-gray-100"
              onError={(e) => {
                e.currentTarget.src = "/avatar-default.svg";
              }}
            />
            <span className="absolute -bottom-3 right-0 bg-green-600 text-white rounded-full px-3 py-1 text-xs shadow font-bold tracking-wide border-2 border-white">ENTREPRISE</span>
          </div>
          <h2 className="text-4xl font-extrabold text-green-700 mb-1 flex items-center gap-3 drop-shadow-sm">
            <Building2 className="w-8 h-8 text-green-400" /> {entreprise.nom}
          </h2>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="flex items-center gap-3 text-gray-700 bg-white/70 rounded-lg p-3 shadow-sm">
              <Mail className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Email:</span> <span className="truncate">{entreprise.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-white/70 rounded-lg p-3 shadow-sm">
              <Phone className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Téléphone:</span> {entreprise.telephone}
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-white/70 rounded-lg p-3 shadow-sm col-span-1 sm:col-span-2">
              <MapPin className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Adresse:</span> {entreprise.adresse || '-'}
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-white/70 rounded-lg p-3 shadow-sm">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Devise:</span> {entreprise.devise}
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-white/70 rounded-lg p-3 shadow-sm">
              <BadgeCheck className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Statut:</span> {entreprise.statut || '-'}
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-white/70 rounded-lg p-3 shadow-sm">
              <CalendarCheck className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Créée le:</span> {entreprise.createdAt ? new Date(entreprise.createdAt).toLocaleDateString() : '-'}
            </div>
            <div className="flex items-center gap-3 text-gray-700 bg-white/70 rounded-lg p-3 shadow-sm">
              <Palette className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Couleurs:</span>
              <div className="flex gap-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: entreprise.couleurPrimaire }}
                  title="Couleur primaire"
                />
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: entreprise.couleurSecondaire }}
                  title="Couleur secondaire"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepriseDetails;
