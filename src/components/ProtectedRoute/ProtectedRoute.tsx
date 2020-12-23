import { useRouter } from 'next/router';
import { useAuth } from '../../context/authenticaton';

export const ProtectedRoute = Component =>
  function Comp(props) {
    const { loggedIn, loading } = useAuth();
    const router = useRouter();
    if (!loggedIn) {
      if (loading) {
        return <>Loading</>;
      } else {
        router.push('/login');
      }
    }
    return <Component />;
  };
