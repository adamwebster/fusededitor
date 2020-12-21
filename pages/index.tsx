import Link from "next/link";
import { Layout } from "../src/components/Layout";

const Index = () => {
  return <Layout><Link href="/editor"><a>Editor</a></Link></Layout>;
};

export default Index;
