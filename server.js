import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'chat-group' });

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(new URL('./index.html', import.meta.url).pathname);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', async (msg) => {
    try {
      await producer.send({
        topic: 'chat-messages',
        messages: [{ value: JSON.stringify({ message: msg, userId: socket.id }) }],
      });
    } catch (error) {
      console.error('Error producing message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageContent = JSON.parse(message.value.toString());
      io.emit('chat message', messageContent.message);
    },
  });
};

const startServer = async () => {
  await producer.connect();
  await runConsumer();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch(console.error);