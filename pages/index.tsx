import { Editor } from '../src/components/Editor';
import { Layout } from '../src/components/Layout';
import { Panel } from '../src/components/Panel';

export default function Home() {
  return (
    <Layout>
      <Editor content="Test" />
      <Panel>
        <h3>Blocks</h3>
        <h3>Document Settings</h3>
        <h3>Attachments</h3>
      </Panel>
    </Layout>
  );
}
