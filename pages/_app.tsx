import { AppProps } from 'next/dist/next-server/lib/router/router';
import { ToastProvider } from '../src/components/Toast/ToastProvider';
import { AuthProvider } from '../src/context/authenticaton';
import { UserProvider } from '../src/context/user';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AuthProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default MyApp;
