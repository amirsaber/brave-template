const Joi = require('joi');
const uuid = require('uuid');

const createQuery = 'INSERT INTO companies ( id, name, street, city, state ) VALUES ( $1, $2, $3, $4, $5 )';
const getByIdQuery = 'SELECT * FROM companies WHERE id = $1';
const getAllQuery = 'SELECT * FROM companies';

exports.setup = (server, client) => {
  server.route({
    method: 'GET',
    path: '/api/1/company',
    handler: async function (request, reply) {
      try {
        const rows = (await client.query(getAllQuery)).rows;
        reply(rows);
      } catch (e) {
        reply(e.toString()).code(500)
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/api/1/company/{guid}',
    handler: async function (request, reply) {
      const guid = request.params.guid;
      try {
        const rows = (await client.query(getByIdQuery, [guid])).rows;
        if (rows.length < 1) {
          reply().code(404);
        } else {
          reply(rows[0]);
        }
        reply(row);
      } catch (e) {
        reply(e.toString()).code(500)
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/api/1/company',
    handler: async function (request, reply) {
      const payload = request.payload;
      try {
        const generatedUUID = uuid.v4();
        const result = await client.query(createQuery, [generatedUUID, payload.name, payload.street, payload.city, payload.state]);
        const row = (await client.query(getByIdQuery, [generatedUUID])).rows[0];
        reply(row).code(201);
      } catch (e) {
        reply(e.toString()).code(500)
      }
    },
    config: {
      validate: {
        payload: {
          name: Joi.string().required(),
          street: Joi.string().optional(),
          city: Joi.string().optional(),
          state: Joi.string().required()
        }
      }
    }
  });
}
