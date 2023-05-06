# fastify-vite-test

Simple reproduction of bug related serving a vite app with fastify configured to user https.

https://github.com/fastify/fastify-vite/issues/109

## Reproduction steps

```sh
git clone https://github.com/benatshippabo/fastify-vite-test.git
cd fastify-vite-test
yarn
yarn ts-node devserver.ts
```

- go to https://localhost:3000
- check console for errors about not being able to connect to wss://localhost:24678/
- try to edit ./src/App.tsx
- notice hmr does not work
