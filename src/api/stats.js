exports.setup = (server, client) => {
  server.route({
    method: 'GET',
    path: '/api/1/stats',
    handler: async function (request, reply) {
      return 'Hello, world!';
    }
  });
}
