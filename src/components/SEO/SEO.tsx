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
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#81D0FF" />
      <meta name="theme-color" content="#ffffff" />
    </Helmet>
  );
};

export default SEO;
