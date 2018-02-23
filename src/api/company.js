exports.setup = (server, client) => {
  server.route({
    method: 'GET',
    path: '/api/1/company',
    handler: async function (request, reply) {
      return 'Hello, world!';
    }
  });
}
