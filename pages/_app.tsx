import { AppProps } from 'next/dist/next-server/lib/router/router';
import { ToastProvider } from '../src/components/Toast/ToastProvider';
import { AuthProvider } from '../src/context/authenticaton';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default MyApp;
