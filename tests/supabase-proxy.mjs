import http from "node:http";
http.createServer((req, res) => {
  const p = http.request({ host: "127.0.0.1", port: 3001, path: req.url.replace(/^\/rest\/v1/, ""), method: req.method, headers: req.headers }, (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
  req.pipe(p);
}).listen(3002);
