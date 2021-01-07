import { AppProps } from 'next/dist/next-server/lib/router/router';
import { ToastProvider } from '../src/components/Toast/ToastProvider';
import { AuthProvider } from '../src/context/authenticaton';
import { SiteProvider } from '../src/context/site';
import { UserProvider } from '../src/context/user';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AuthProvider>
        <SiteProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </SiteProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default MyApp;
