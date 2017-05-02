import http from 'http'
import app from './app'

const port = normalizePort(process.env.PORT || 3001)

let server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
console.log('listen to', port)

function normalizePort(val) {
    var port = parseInt(val, 10)

    if (isNaN(port)) {
        return val
    }

    if (port >= 0) {
        return port
    }

    return false
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}

process.on('message', function(msg) {
    if (msg == 'shutdown') {
        server.close(function() {
            process.exit(0);
        });
        setTimeout(function() {
            process.exit(0);
        }, 30*1000)
    }
})