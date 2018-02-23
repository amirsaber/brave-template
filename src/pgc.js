/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const { Client } = require('pg');
const config = require('config');

const DATABASE_URL = config.get('DATABASE_URL');
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL must be set to the Postgres connection URL');
}

export function setup(cb) {
  console.log('Connecting to Postgres at ' + DATABASE_URL);
  const client = new Client(DATABASE_URL);
  // Connect to Postgres
  client.connect(function (err) {
    if (err) {
      throw new Error(err);
    }
    cb(err, client)
  });
}
