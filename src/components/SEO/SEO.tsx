import { Helmet } from 'react-helmet';

interface Props {
  title?: string;
}
const SEO = ({ title }: Props) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <html lang="en" />
      <title>{title ? title + ' | ' : ''}Fused Editor</title>
    </Helmet>
  );
};

export default SEO;
