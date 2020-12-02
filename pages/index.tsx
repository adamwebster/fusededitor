import { Editor } from '../src/components/Editor';
import { Layout } from '../src/components/Layout';

export default function Home() {
  return (
    <Layout>
      <Editor content="Test" />
    </Layout>
  );
}
