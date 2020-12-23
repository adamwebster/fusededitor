import styled from 'styled-components';
import { InnerPage, Layout } from '../src/components/Layout';
import { ProtectedRoute } from '../src/components/ProtectedRoute/ProtectedRoute';
import { Colors } from '../src/styles/colors';


const Settings = () => {
  return (
    <Layout>
      <InnerPage>
        <h1>Settings</h1>
      </InnerPage>
    </Layout>
  );
};

export default ProtectedRoute(Settings);
