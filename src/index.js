const config = require('config');
const Hapi = require('hapi');
const async = require('async');
const _ = require('underscore');
const assert = require('assert')

const pgc = require('./pgc');

const stats = require('./api/stats');
const company = require('./api/company');

let kickoff = (err, connections) => {
  if (err) {
    throw new Error(err);
  }

  const port = config.get('port');
  const host = config.get('host');
  const server = new Hapi.Server()
  const connection = server.connection({
    host: host,
    port: port
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
