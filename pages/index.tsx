import { Editor } from '../src/components/Editor';
import { Layout } from '../src/components/Layout';
import { Panel } from '../src/components/Panel';

export default function Home() {
  return (
    <Layout>
      <Editor
        content={[{ type: 'heading', content: 'Heading', element: 'h3' }]}
      />
    </Layout>
  );
}
