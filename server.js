const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) {
      // unknown paths fall back to the app itself
      return fs.readFile(path.join(ROOT, "index.html"), (e2, html) => {
        res.writeHead(200, { "content-type": TYPES[".html"], "cache-control": "no-cache" });
        res.end(html);
      });
    }
    const ext = path.extname(file);
    res.writeHead(200, {
      "content-type": TYPES[ext] || "application/octet-stream",
      "cache-control": ext === ".png" ? "public, max-age=604800" : "no-cache",
    });
    res.end(data);
  });
}).listen(process.env.PORT || 3000, () => console.log("תוכנית אימון פועלת"));
