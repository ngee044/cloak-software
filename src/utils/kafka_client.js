import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: [process.env.KAFKA_BROKER],
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'chat-group' });

export const connectKafka = async () => {
try {
	await producer.connect();
		console.log('Kafka producer connected');
	await consumer.connect();
		console.log('Kafka consumer connected');
	} catch (error) {
		console.error('Failed to connect to Kafka:', error);
	}
};