const db = require('../../config/db');

// User Model
const User = db.users;

// Helper
const ResponseBulider = require('../helpers/responseBulider');

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

        let data = {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age ? req.body.age : 0,
            address: req.body.address ? req.body.address : 'Tidak Ada Alamat',
        }

        // Process Create
        await User.create(data).then((result) => {

            // Return 
            return ResponseBulider.success(res, result);            
        })
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