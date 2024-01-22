/**
 * This proxy is designed to interact with the API on the dev server according to the CORS policy.
 */
import { IncomingMessage } from 'http';
import { createProxyServer } from 'http-proxy';

const onClose = () => {
  console.log('Proxy server stopped');
  process.removeListener('SIGINT', onClose);
  process.exit();
};
process.addListener('SIGINT', onClose);

try {
  createProxyServer({ target: 'https://dev.appknit.io/graphql', changeOrigin: true, secure: false })
    .on('proxyRes', (proxyRes: IncomingMessage, req: IncomingMessage) => {
      proxyRes.headers['access-control-allow-origin'] = req.headers['origin'];
      console.log('RAW Response from the target', JSON.stringify(proxyRes.headers, undefined, 2));
    })
    .listen(3001);
  console.log('Proxy server started');
} catch (e) {
  console.error(e);
}
