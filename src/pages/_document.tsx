import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
        <script defer
            type="text/javascript"
            src="https://appleid.cdn.apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>



<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com"/>
<link href="https://fonts.googleapis.com/css2?family=Jomhuria&display=swap" rel="stylesheet"/>


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
