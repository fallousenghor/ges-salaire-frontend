import { useState } from 'react';
import { messagesFr } from '../utils/message.fr';
import { useNavigate } from 'react-router-dom';
import MyInput from '../ui/MyInput';
import { apiFetch } from '../api/apiFetch';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // No forced redirection or logic for cashier users. Page is only shown when navigated to.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!oldPassword) {
      setError(messagesFr.ancienMotDePasseObligatoire);
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError(messagesFr.nouveauMotDePasseCourt);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(messagesFr.passwordMismatch);
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          ancienMotDePasse: oldPassword,
          nouveauMotDePasse: newPassword
        }),
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true, state: { passwordChanged: true } });
      }, 2000);
    } catch {
      setError(messagesFr.erreurChangementMotDePasse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-green-100 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">{messagesFr.changerMotDePasse}</h2>
        {error && <div className="text-red-600 text-sm mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-4 text-center">Mot de passe changé avec succès ! Veuillez vous reconnecter avec votre nouveau mot de passe.</div>}
        <div className="space-y-4">
          <MyInput
            type="password"
            placeholder={messagesFr.ancienMotDePasseObligatoire.replace('Veuillez saisir ', '')}
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            autoComplete="current-password"
          />
          <MyInput
            type="password"
            placeholder={messagesFr.nouveauMotDePasseCourt.replace('Le ', '').replace(' doit contenir au moins 6 caractères.', '')}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <MyInput
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200 tracking-wide ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? messagesFr.changement : messagesFr.valider}
          </button>
        </div>
      </form>
    </div>
  );
}
