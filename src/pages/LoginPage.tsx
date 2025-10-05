import { User, Lock } from 'lucide-react';
import MyInput from '../ui/MyInput';
import { useState } from 'react';
import { messagesFr } from '../utils/message.fr';
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const { login, loading, error } = useLogin();

  const handleLogin = async () => {
    try {
      // Validation côté client
      if (!email) {
        throw new Error("L'adresse email est requise");
      }
      if (!email.includes('@')) {
        throw new Error("L'adresse email n'est pas valide");
      }
      if (!motDePasse) {
        throw new Error("Le mot de passe est requis");
      }
      if (motDePasse.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }

      await login(email, motDePasse);
      // La redirection est gérée dans le hook useLogin
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useLogin
      if (error instanceof Error) {
        console.error('Erreur de connexion:', error.message);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 animate-fade-in">
      <div className="w-full max-w-md p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-green-200 animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-green-500 to-green-700 rounded-full flex items-center justify-center mb-3 shadow-lg">
              {/* Logo SVG moderne */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#fff"/><text x="50%" y="55%" textAnchor="middle" fill="#16a34a" fontSize="18" fontWeight="bold" dy=".3em">GE</text></svg>
            </div>
            <h1 className="text-3xl font-extrabold text-green-700 tracking-tight drop-shadow">{messagesFr.connexion}</h1>
            <p className="text-gray-500 mt-2 text-base text-center">{messagesFr.bienvenue}</p>
          </div>
          <div className="space-y-7">
            <MyInput
              type="email"
              placeholder={messagesFr.adresseEmail}
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<User size={22} />}
              autoComplete="email"
            />
            <span className="text-xs text-gray-400 ml-1">Exemple : nom@entreprise.com</span>
            <MyInput
              type="password"
              placeholder={messagesFr.motDePasse}
              value={motDePasse}
              onChange={e => setMotDePasse(e.target.value)}
              icon={<Lock size={22} />}
              autoComplete="current-password"
            />
            <span className="text-xs text-gray-400 ml-1">Votre mot de passe est confidentiel.</span>
            <div className="flex items-center justify-between text-sm mt-2">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                {messagesFr.seSouvenir}
              </label>
              <a href="#" className="text-green-600 hover:text-green-500 underline underline-offset-2">
                {messagesFr.motDePasseOublie}
              </a>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center font-medium mb-2 animate-shake">{error}</div>
            )}
            <button
              onClick={handleLogin}
              type="button"
              disabled={loading}
              className={`w-full bg-gradient-to-tr from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200 tracking-wide flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/></svg>
                  {messagesFr.connexionEnCours}
                </span>
              ) : (
                <span>{messagesFr.seConnecter}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;