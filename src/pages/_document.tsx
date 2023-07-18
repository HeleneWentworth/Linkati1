import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
      
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>



<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com"/>
<link href="https://fonts.googleapis.com/css2?family=Jomhuria&display=swap" rel="stylesheet"/>
<script src="https://fonts.googleapis.com/icon?family=Material+Icons"></script>

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
