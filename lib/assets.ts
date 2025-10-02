// Helper para manejar rutas de assets en GitHub Pages
export const getAssetPath = (path: string) => {
  const basePath = process.env.NODE_ENV === 'production' ? '/OS3-Synergy-default-dashboard' : '';
  return `${basePath}${path}`;
};