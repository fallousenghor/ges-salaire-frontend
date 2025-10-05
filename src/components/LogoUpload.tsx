import { type ChangeEvent, useState } from 'react';

interface LogoUploadProps {
  onFileSelect: (file: File) => void;
}

export const LogoUpload = ({ onFileSelect }: LogoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      // Vérifier la taille du fichier (2MB maximum)
      if (file.size > 2 * 1024 * 1024) {
        setError("Le fichier est trop volumineux. La taille maximale est de 2MB.");
        return;
      }

      // Vérifier le type du fichier
      if (!file.type.startsWith('image/')) {
        setError("Seules les images sont acceptées.");
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);

      // Clean up the preview URL when component unmounts
      return () => URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">Logo de l&apos;entreprise</label>
      {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {previewUrl && (
          <div className="flex-shrink-0">
            <img
              src={previewUrl}
              alt="Logo preview"
              className="h-24 w-auto rounded-md border border-gray-200 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
};
