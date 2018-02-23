const Joi = require('joi');
const uuid = require('uuid');
const _ = require('underscore');

const createQuery = 'INSERT INTO companies ( id, name, street, city, state ) VALUES ( $1, $2, $3, $4, $5 )';
const getByIdQuery = 'SELECT * FROM companies WHERE id = $1';
const getAllQuery = 'SELECT * FROM companies';
const updateById = 'UPDATE companies SET (name, street, city, state) = ($2, $3, $4, $5) WHERE id = $1';
const deleteById = 'DELETE FROM companies WHERE id = $1';

exports.setup = (server, client) => {
  server.route({
    method: 'GET',
    path: '/api/1/company',
    handler: async function (request, reply) {
      try {
        let query = getAllQuery;
        const params = request.query;
        _.each(Object.keys(params), function (key, index) {
          if (index !== 0) {
            query += ' AND'
          } else if (index === 0) {
            query += ' WHERE';
          }
          const val = params[key];
          query += ` ${key}='${val}'`;
        });
        const rows = (await client.query(query)).rows;
        reply(rows);
      } catch (e) {
        reply(e.toString()).code(500)
      }
    },
    config: {
      validate: {
        query: {
          id: Joi.string().uuid(),
          name: Joi.string(),
          street: Joi.string(),
          city: Joi.string(),
          state: Joi.string()
        }
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
      } catch (e) {
        reply(e.toString()).code(500)
      }
    },
    config: {
      validate: {
        params: {
          guid: Joi.string().uuid()
        }
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

  server.route({
    method: 'PUT',
    path: '/api/1/company/{guid}',
    handler: async function (request, reply) {
      const payload = request.payload;
      try {
        const guid = request.params.guid;
        let row = (await client.query(getByIdQuery, [guid])).rows[0];
        if (!row) {
          reply().code(404);
        } else {
          const result = await client.query(updateById, [guid, payload.name, payload.street, payload.city, payload.state]);
          row = (await client.query(getByIdQuery, [guid])).rows[0];
          reply(row).code(200);
        }
      } catch (e) {
        reply(e.toString()).code(500)
      }
    },
    config: {
      validate: {
        params: {
          guid: Joi.string().uuid()
        },
        payload: {
          id: Joi.forbidden(),
          name: Joi.string().required(),
          street: Joi.string().optional(),
          city: Joi.string().optional(),
          state: Joi.string().required()
        }
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/api/1/company/{guid}',
    handler: async function (request, reply) {
      const payload = request.payload;
      try {
        const guid = request.params.guid;
        let row = (await client.query(getByIdQuery, [guid])).rows[0];
        if (!row) {
          reply().code(404);
        } else {
          const result = await client.query(deleteById, [guid]);
          reply().code(203);
        }
      } catch (e) {
        reply(e.toString()).code(500)
      }
    },
    config: {
      validate: {
        params: {
          guid: Joi.string().uuid()
        }
      }
    }
  });
}
