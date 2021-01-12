import { useRouter } from 'next/router';
import { useAuth } from '../../context/authenticaton';
import { GlobalStyles } from '../Layout/layout';

export const ProtectedRoute = (Component:any) =>
  function Comp(props:any) {
    const { loggedIn, loading } = useAuth();
    const router = useRouter();
    if (!loggedIn) {
      if (loading) {
        return (
          <>
            <GlobalStyles />
          </>
        );
      } else {
        router.push('/login');
      }
    }
    if (loggedIn) {
      return <Component />;
    }
    return (
      <>
        <GlobalStyles />
      </>
    );
  };
