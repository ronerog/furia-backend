const amqp = require('amqplib');
const config = require('../config/rabbitmq.config');

let connection = null;
let channel = null;

/**
 * Inicializa a conexão com o RabbitMQ
 */
async function connect() {
  try {
    // Conectar ao servidor RabbitMQ
    connection = await amqp.connect(config.url);
    channel = await connection.createChannel();
    
    // Configurar exchanges
    await channel.assertExchange(config.exchanges.chat, 'fanout', { durable: true });
    await channel.assertExchange(config.exchanges.notifications, 'direct', { durable: true });
    
    // Configurar filas
    await channel.assertQueue(config.queues.chat, { durable: true });
    await channel.assertQueue(config.queues.notifications, { durable: true });
    
    // Vincular filas às exchanges
    await channel.bindQueue(config.queues.chat, config.exchanges.chat, '');
    
    console.log('RabbitMQ conectado com sucesso');
    return { connection, channel };
  } catch (error) {
    console.error('Erro ao inicializar RabbitMQ:', error);
    throw error;
  }
}

/**
 * Publica uma mensagem de chat na exchange
 * @param {Object} message Mensagem a ser publicada
 */
async function publishChatMessage(message) {
  if (!channel) {
    await connect();
  }
  
  try {
    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.publish(config.exchanges.chat, '', messageBuffer, { persistent: true });
    console.log('Mensagem de chat publicada');
    return true;
  } catch (error) {
    console.error('Erro ao publicar mensagem de chat:', error);
    throw error;
  }
}

/**
 * Envia uma notificação para um usuário específico
 * @param {string} userId ID do usuário
 * @param {Object} notification Dados da notificação
 */
async function sendUserNotification(userId, notification) {
  if (!channel) {
    await connect();
  }
  
  try {
    const notificationData = {
      userId,
      content: notification.content,
      type: notification.type,
      timestamp: new Date()
    };
    
    channel.publish(
      config.exchanges.notifications,
      userId, // Routing key é o ID do usuário
      Buffer.from(JSON.stringify(notificationData)),
      { persistent: true }
    );
    
    console.log(`Notificação enviada para usuário ${userId}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    throw error;
  }
}

/**
 * Configura um consumer para a fila de chat
 * @param {Function} callback Função a ser chamada quando uma mensagem for recebida
 */
async function consumeChatMessages(callback) {
  if (!channel) {
    await connect();
  }
  
  try {
    await channel.consume(config.queues.chat, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        channel.ack(msg);
      }
    });
    
    console.log('Consumer de mensagens de chat configurado');
  } catch (error) {
    console.error('Erro ao configurar consumer de chat:', error);
    throw error;
  }
}

/**
 * Configura um consumer para a fila de notificações de usuário
 * @param {Function} callback Função a ser chamada quando uma notificação for recebida
 */
async function consumeNotifications(callback) {
  if (!channel) {
    await connect();
  }
  
  try {
    await channel.consume(config.queues.notifications, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        channel.ack(msg);
      }
    });
    
    console.log('Consumer de notificações configurado');
  } catch (error) {
    console.error('Erro ao configurar consumer de notificações:', error);
    throw error;
  }
}

/**
 * Fecha a conexão com o RabbitMQ
 */
async function close() {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    console.log('Conexão com RabbitMQ fechada');
  } catch (error) {
    console.error('Erro ao fechar conexão com RabbitMQ:', error);
  }
}

// Configurar handlers para fechar conexão graciosamente
process.on('exit', close);
process.on('SIGINT', async () => {
  await close();
  process.exit(0);
});

module.exports = {
  connect,
  publishChatMessage,
  sendUserNotification,
  consumeChatMessages,
  consumeNotifications,
  close
};