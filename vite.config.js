import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    federation({
      name: 'main-app',
      remotes: {
        musicLibrary: mode === 'production' 
          ? 'https://music-library-mf.netlify.app/assets/remoteEntry.js'
          : 'http://localhost:3001/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
}))