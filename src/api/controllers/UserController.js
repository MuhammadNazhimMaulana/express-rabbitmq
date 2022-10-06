const db = require('../../config/db');

// User Model
const User = db.users;

// Helper
const ResponseBulider = require('../helpers/responseBulider');

let amqp = require('amqplib/callback_api');

class UserController{

    // Sending To Rabbitmq
    rabbit = (severity, data) => {
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
            channel.publish(exchange, severity, Buffer.from(msg));
            console.log(" [x] Sent %s: '%s'", severity, msg);
          });
        
          setTimeout(function() {
            connection.close();
            process.exit(0)
          }, 500);
        });
    }

    // All Data
    index = async (req, res) => {
        try {

            // Getting all users
            const users = await User.findAll({})

            return ResponseBulider.success(res, users);
        } catch (error) {
            // If Error
            return res.status(500).send({
                message: error.message || "Terjadi Error"
            })
        }
    }

    // Get One User
    show = async (req, res) => {
        try {

            // Finding one User
            const user = await User.findOne({ where: { id: req.params.id }});

            // If id isn't found
            if(user == null){
                return ResponseBulider.error(res, 404, 'User Not Found');   
            }

            return ResponseBulider.success(res, user);
        } catch (error) {
            // If Error
            return ResponseBulider.error(res, 500, error.message); 
        }
    }

    // Create Data
    store = async (req, res) => {

        let data = {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age ? req.body.age : 0,
            address: req.body.address ? req.body.address : 'Tidak Ada Alamat',
        }

        // Sending to Rabbitmq
        const send = this.rabbit('insert_user', JSON.stringify(data));

        // Return 
        return ResponseBulider.success(res, send); 

        // Process Create
        // await User.create(data).then((result) => {

        //     // Return 
        //     return ResponseBulider.success(res, result);            
        // })
    }

    // Update One User
    update = async (req, res) => {
        try {

            // Finding one User
            const user = await User.findOne({ where: { id: req.params.id }});

            // If id isn't found
            if(user == null){
                return ResponseBulider.error(res, 404, 'User Not Found');   
            }else{
                // Update one User
               await User.update(req.body, { where: { id: user.id }});
            }


            return ResponseBulider.success(res, user);
        } catch (error) {
            // If Error
            return ResponseBulider.error(res, 500, error.message); 
        }
    }

    // Delete one User
    delete = async (req, res) => {
        try {

            // Finding one User
            const user = await User.findOne({ where: { id: req.params.id }});

            // If id isn't found
            if(user == null){
                return ResponseBulider.error(res, 404, 'User Not Found');   
            }else{
                // Delete one User
               await User.destroy({ where: { id: user.id }});
            }


            return ResponseBulider.success(res, 'User Deleted');
        } catch (error) {
            // If Error
            return ResponseBulider.error(res, 500, error.message); 
        }
    }

}

module.exports = UserController