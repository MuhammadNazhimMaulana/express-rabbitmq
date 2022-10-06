#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

// Array for severity
const args = ["insert_user", "update_user", "delete_user"]

amqp.connect('amqp://localhost', function(error0, connection) {

  if (error0) {
    throw error0;
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    var exchange = 'direct_logs';

    // Menggunakan direct exchange
    channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
      }, function(error2, q) {
        if (error2) {
          throw error2;
        }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      // Foreach untuk binding exchange dengan queuenya
      args.forEach(function(severity) {
        channel.bindQueue(q.queue, exchange, severity);
      });

      channel.consume(q.queue, function(msg) {
        console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
      }, {
        noAck: true
      });

    });

  });

});