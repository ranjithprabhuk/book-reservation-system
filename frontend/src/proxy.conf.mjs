export default {
    '/api/*': {
        "target": 'http://localhost:3000',
        "secure": false,
        "bypass": function (req, res, proxyOptions) {
            // if (req.headers.accept.includes('html')) {
            //     console.log('Skipping proxy for browser request.');
            //     return '/index.html';
            // }
            res.headers['access-control-allow-origin'] = req.headers['origin'];
            console.log('resssss >>', res)
            // req.headers['X-Custom-Header'] = 'yes';
        }
    }
};

// export default [
//     {
//         target: 'http://localhost:3000',
//         secure: false
//     }
// ];
// {
//     "/api/*": {
//         "target": "http://localhost:3000/",
//         "secure": false,
//         "logLevel": "debug",
//         "changeOrigin": true
//     }
// }