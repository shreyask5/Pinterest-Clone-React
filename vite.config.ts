import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-avatar', '@radix-ui/react-toast'],
          'utils-vendor': ['date-fns', 'axios', 'lucide-react'],
          // Component chunks
          'components': [
            './src/components/Header.tsx',
            './src/components/PinCard.tsx',
            './src/components/PinDialog.tsx',
            './src/components/AuthDialog.tsx',
            './src/components/UploadDialog.tsx'
          ]
        }
      }
    }
  }
}));
