module.exports = {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    exchanges: {
      chat: 'chat_exchange',
      notifications: 'notifications_exchange'
    },
    queues: {
      chat: 'chat_messages',
      notifications: 'user_notifications'
    }
  };