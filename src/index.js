const Hapi = require('hapi');
const AuthBearer = require('hapi-auth-bearer-token');

const config = require('config');
const async = require('async');
const _ = require('underscore');
const assert = require('assert')

const pgc = require('./pgc');

const stats = require('./api/stats');
const company = require('./api/company');

let kickoff = async (err, connections) => {
  if (err) {
    throw new Error(err);
  }

  const PORT = config.get('PORT');
  const HOST = config.get('HOST');
  const server = new Hapi.Server();

  const connection = server.connection({
    host: HOST,
    port: PORT
  });

  // Setup Auth Strategy
  server.register(AuthBearer, (err) => {
    server.auth.strategy('simple', 'bearer-access-token', {
      validateFunc: function (token, callback) {
        const AUTH_TOKEN = config.get('AUTH_TOKEN');
        if (token === AUTH_TOKEN) {
          return callback(null, true, { token: token })
        }
        return callback(null, false, { token: token })
      }
    });
    server.auth.default('simple');
  });

  // Setup the APIs
  _.each([stats, company], (api) => { api.setup(server, connections.pg) });

  server.start((err) => {
    assert(!err, `error starting service ${err}`);
    console.log('Service started');
  });
}

// Connect to Postgres
async.parallel(
  {
    pg: pgc.setup
  },
  kickoff
);
