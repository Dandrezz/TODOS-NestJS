/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    urlApi: 'https://dandrezz-deno-api-todo.deno.dev/todo',
  },
}

module.exports = nextConfig
