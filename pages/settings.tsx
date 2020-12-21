import styled from 'styled-components';
import { Layout } from "../src/components/Layout";
import { Colors } from '../src/styles/colors';

const StyledSettingsPage = styled.div`
    margin: 16px;
    padding: 16px;
    box-sizing:border-box;
    width: 100%;
    background-color: ${Colors.GREY[500]};
    display:flex;
`
const Settings = () => {
  return <Layout>
      <StyledSettingsPage>
          <h1>Settings</h1>
      </StyledSettingsPage>
  </Layout>;
};

export default Settings;
