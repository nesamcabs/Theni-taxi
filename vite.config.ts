import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, here, ['VITE_', 'EXPO_PUBLIC_']);
  const processEnv: Record<string, string> = { NODE_ENV: mode === 'production' ? 'production' : 'development' };
  for (const [k, v] of Object.entries(env)) if (k.startsWith('EXPO_PUBLIC_')) processEnv[k] = v;
  if (env.VITE_API_URL && !processEnv.EXPO_PUBLIC_API_URL) processEnv.EXPO_PUBLIC_API_URL = env.VITE_API_URL;
  if (!processEnv.EXPO_PUBLIC_API_URL && processEnv.EXPO_PUBLIC_USE_FIREBASE_EMULATORS !== 'true') processEnv.EXPO_PUBLIC_API_URL = 'https://nesam-travels-api.vercel.app';

  const projectId = processEnv.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'nesamtoursandtravels-202f5';

  return {
    tsconfig: path.resolve(here, 'tsconfig.json'),
    plugins: [react()],
    envPrefix: ['VITE_', 'EXPO_PUBLIC_'],
    resolve: {
      alias: {
        '@core': path.resolve(here, './src/core'),
        '@': path.resolve(here, 'src'),
        'expo-location': path.resolve(here, 'src/platform/expoLocation.ts'),
      },
      dedupe: ['firebase', '@firebase/app', '@firebase/auth', '@firebase/firestore', '@firebase/functions', '@firebase/storage', 'react', 'react-dom'],
    },
    define: {
      __DEV__: JSON.stringify(mode !== 'production'),
      'process.env': JSON.stringify(processEnv),
    },
    server: {
      host: '0.0.0.0',
      port: Number(process.env.PORT || 8090),
      fs: { allow: [here, path.resolve(here, './src/core'), path.resolve(here, './src/shared/components')] },
    },
    preview: { host: '0.0.0.0', port: Number(process.env.PORT || 8090) },
    build: {
      target: 'es2022',
      sourcemap: false,
      chunkSizeWarningLimit: 900,
    },
  };
});
