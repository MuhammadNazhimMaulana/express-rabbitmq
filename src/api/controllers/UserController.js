const db = require('../../config/db');

// User Model
const User = db.users;

// Helpers
const ResponseBulider = require('../helpers/responseBulider');

// Rabbit MQ
const rabbitmq = require('../../config/rabbitmq')

class UserController{

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

        // Instance For Rabbit MQ
        const broker = await rabbitmq.getInstance()
        
        let data = {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age ? req.body.age : 0,
            address: req.body.address ? req.body.address : 'Tidak Ada Alamat',
        }

        // Sending to Rabbitmq
        broker.publish('store_user', JSON.stringify(data))

        // Directly Consume
        broker.consume('store_user', async (msg) => {
            // Process Create
            await User.create(JSON.parse(msg)).then((result) => {
                
            })
        })
        
        // Return 
        return ResponseBulider.success(res, 'Store User Berhasil');            
    }

    // Request Update One User
    update = async (req, res) => {
        try {
            // Instance For Rabbit MQ
            const broker = await rabbitmq.getInstance()

            // Finding one User
            const user = await User.findOne({ where: { id: req.params.id }});

            // If id isn't found
            if(user == null){
                return ResponseBulider.error(res, 404, 'User Not Found');   
            }else{

                // Combining the data (old and new)
                const data ={ ...user.dataValues, ...req.body }

                // Sending to Rabbitmq
                broker.publish('update_user', JSON.stringify(data))

                // Directly Consume
                broker.consume('update_user', async (msg) => {
                    // Object Result
                    const result = JSON.parse(msg)

                    // Preparing Data
                    let update_data = {
                        name: result.name,
                        email: result.email,
                        age: result.age,
                        address: result.address, 
                    }
                
                    // Update one User
                    await User.update(update_data, { where: { id: result.id }});
                })
            }

            // Return 
            return ResponseBulider.success(res, "Update User Berhasil"); 

        } catch (error) {
            // If Error
            return ResponseBulider.error(res, 500, error.message); 
        }
    }

    // Delete one User
    delete = async (req, res) => {
        try {
            // Instance For Rabbit MQ
            const broker = await rabbitmq.getInstance()

            // Finding one User
            const user = await User.findOne({ where: { id: req.params.id }});

            // If id isn't found
            if(user == null){
                return ResponseBulider.error(res, 404, 'User Not Found');   
            }else{

                // Combining the data (old and new)
                const data = req.params.id

                // Sending to Rabbitmq
                broker.publish('delete_user', JSON.stringify(data))

                // Directly Consume
                broker.consume('delete_user', async (msg) => {
                    // Object Result
                    const result = JSON.parse(msg)
                    
                    // Delete one User
                    await User.destroy({ where: { id: result }});
                })
            }

            return ResponseBulider.success(res, 'User Deleted');
        } catch (error) {
            // If Error
            return ResponseBulider.error(res, 500, error.message); 
        }
    }

}

module.exports = UserController