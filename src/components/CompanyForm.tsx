import MyInput from '../ui/MyInput';
import { messagesFr } from '../utils/message.fr';
import type { CompanyFormProps } from "../types/propsType";
import { useEntrepriseForm } from '../hooks/useEntrepriseForm';
import { LogoUpload } from './LogoUpload';
import { ColorPicker } from './ColorPicker';




const CompanyForm: React.FC<CompanyFormProps> = ({ entrepriseId }) => {
  const {
    form,
    setForm,
    loading,
    error,
    handleChange,
    handleSubmit
  } = useEntrepriseForm(entrepriseId);



  // Ajout d'une fonction pour soumettre et nettoyer le formulaire après création
  const handleSubmitAndReset = async (e: React.FormEvent) => {
    await handleSubmit(e, () => {
      if (!entrepriseId) setForm({
        nom: "",
        email: "",
        telephone: "",
        adresse: "",
        logo: "",
        devise: "XOF",
        typePeriode: "MENSUEL",
      });
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-blue-600">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-lg font-medium">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitAndReset} >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {entrepriseId ? messagesFr.modifier : messagesFr.creer} une entreprise
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Remplissez les informations de l'entreprise
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {messagesFr.nomLabel}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <MyInput
            type="text"
            placeholder="Nom de l'entreprise"
            value={form.nom || ""}
            onChange={(e) => handleChange({
              ...e,
              target: { ...e.target, name: 'nom' }
            })}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {messagesFr.emailLabel}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <MyInput
            type="email"
            placeholder="email@entreprise.com"
            value={form.email || ""}
            onChange={(e) => handleChange({
              ...e,
              target: { ...e.target, name: 'email' }
            })}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {messagesFr.telephoneLabel}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <MyInput
            type="text"
            placeholder="+221 XX XXX XX XX"
            value={form.telephone || ""}
            onChange={(e) => handleChange({
              ...e,
              target: { ...e.target, name: 'telephone' }
            })}
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {messagesFr.deviseLabel}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <MyInput
            type="text"
            placeholder="XOF"
            value={form.devise || ""}
            onChange={(e) => handleChange({
              ...e,
              target: { ...e.target, name: 'devise' }
            })}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {messagesFr.adresseLabel}
        </label>
        <MyInput
          type="text"
          placeholder="Adresse complète"
          value={form.adresse || ""}
          onChange={(e) => handleChange({
            ...e,
            target: { ...e.target, name: 'adresse' }
          })}
          autoComplete="off"
        />
      </div>

      <div className="mb-6">
        <LogoUpload onFileSelect={(file) => {
          setForm((prev) => ({ ...prev, logo: file }));
        }} />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {messagesFr.typePeriodeLabel}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          name="typePeriode"
          value={form.typePeriode || ""}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer"
        >
          <option value="MENSUEL">{messagesFr.mensuelle}</option>
          <option value="HEBDO">{messagesFr.hebdomadaire}</option>
          <option value="JOURNALIER">{messagesFr.journaliere}</option>
        </select>
      </div>

      {/* Couleurs d'entreprise */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ColorPicker
          label="Couleur primaire"
          value={form.couleurPrimaire || "#2563eb"}
          onChange={(value) => setForm(prev => ({ ...prev, couleurPrimaire: value }))}
        />
        <ColorPicker
          label="Couleur secondaire"
          value={form.couleurSecondaire || "#1e40af"}
          onChange={(value) => setForm(prev => ({ ...prev, couleurSecondaire: value }))}
        />
      </div>

      {/* <div className="mb-6">
        <LogoUpload onFileSelect={(file) => {
          setForm((prev) => ({ ...prev, logo: file }));
        }} />
      </div> */}

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
        >
          {loading ? messagesFr.enregistrement : entrepriseId ? messagesFr.enregistrer : messagesFr.creer}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;