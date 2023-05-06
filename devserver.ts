import Fastify from 'fastify';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import FastifyVite from '@fastify/vite';

const generateSelfSignedCerts = () => {
  const keyname = "selfsigned";
  const keyFilename = path.resolve(`${keyname}.key`);
  const certFilename = path.resolve(`${keyname}.crt`);

  if (!existsSync(keyFilename) || !existsSync(certFilename)) {
    execSync(
      `openssl req -x509 -nodes -days 3650 -keyout ${keyname}.key -out ${keyname}.crt -newkey rsa:4096 -sha256 -days 3650 -config openssl.conf`
    );
  }

  return {
    key: readFileSync(keyFilename),
    cert: readFileSync(certFilename),
  };
};

(async function () {
  const server = Fastify({
    http2: true,
    https: {
      allowHTTP1: true, // fallback support for HTTP1
      ...generateSelfSignedCerts(),
    },
  });

  await server.register(FastifyVite, {
    dev: true,
    root: path.resolve("."),
    spa: true,
  });

  server.get("/", (req, reply) => {
    reply.html();
  });

  await server.vite.ready();
  await server.listen({ port: 3000 });
})();
