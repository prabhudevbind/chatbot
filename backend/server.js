const express = require('express');

const http = require('http');

const socketIo = require('socket.io');

const { NlpManager } = require('node-nlp');

const app = express();

const server = http.createServer(app);
const io = socketIo(server);
const manager = new NlpManager({ languages: ['en'] });

manager.load();

app.use(express.static('build'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('message', async (message) => {
        const response = await manager.process('en', message);
        socket.emit('response', response.answer);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
