
import  { useState } from "react";
import { messagesFr } from '../utils/message.fr';
import CompanyList from "../components/CompanyList";
import CompanyForm from "../components/CompanyForm";

export default function Superadmin() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setShowForm(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
  <h1 className="text-2xl font-bold">{messagesFr.gestionEntreprises}</h1>
        {/* <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? messagesFr.annuler : messagesFr.creerEntreprise}
        </button> */}
      </div>
      {showForm && <CompanyForm onSuccess={handleSuccess}  />}
      <div className="mt-6">
        <CompanyList key={refreshKey} />
      </div>
    </div>
  );
}
