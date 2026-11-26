import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { router } from './app/router';
import { usePublicProfile } from './features/public/queries';
import { applyFontSettings } from './lib/fontLibrary';

function FontSync() {
  const { data: profile } = usePublicProfile();
  useEffect(() => {
    applyFontSettings(profile?.fonts);
  }, [profile?.fonts]);
  return null;
}

export function App() {
  return (
    <AppProviders>
      <FontSync />
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
