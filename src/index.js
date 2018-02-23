const config = require('config');
const Hapi = require('hapi');

const server = new Hapi.Server({
    host: config.host,
    port: config.port
});
const port = config.get('port');
const host = config.get('host');

server.start((err) => {
    assert(!err, `error starting service ${err}`)
    console.log('Service started')
});