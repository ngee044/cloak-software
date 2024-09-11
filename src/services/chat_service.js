import { producer, consumer } from '../utils/kafka_client.js';

export const sendMessage = async (message, userId) => {
  await producer.send({
    topic: 'chat-messages',
    messages: [{ value: JSON.stringify({ message, userId }) }],
  });
};

export const subscribeToMessages = async (callback) => {
  await consumer.subscribe({ topic: 'chat-messages', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageContent = JSON.parse(message.value.toString());
      callback(messageContent);
    },
  });
};