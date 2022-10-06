let amqp = require('amqplib/callback_api');

class rabbitMqHelper {

    // Sending To Rabbitmq
    static send(severity, data) {
        amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) {
            throw error0;
            }
            connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var exchange = 'direct_logs';
                
            // Ambil mulai dari index pertama dan jadikan string
            var msg = data;
        
            channel.assertExchange(exchange, 'direct', {
                durable: false
            });

            // Publish
            channel.publish(exchange, severity, Buffer.from(msg));
            console.log(" [x] Sent %s: '%s'", severity, msg);

            });

        });
    }

}

module.exports = rabbitMqHelper;