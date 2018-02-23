const _ = require('underscore');

const companyByStateQuery = 'SELECT COUNT(*) as count, state FROM companies GROUP BY state';

exports.setup = (server, client) => {
  server.route({
    method: 'GET',
    path: '/api/1/stats/companyByState',
    handler: async function (request, reply) {
      try {
        const rows = (await client.query(companyByStateQuery)).rows;
        const result = {};
        _.each(rows, function (row) {
          result[row.state] = row.count
        });
        reply(result);
      } catch (e) {
        reply(e.toString()).code(500)
      }
    }
  });
}
