const User = require("../models/user");
const jwt = require('jsonwebtoken');

module.exports = (app) => {

    app.post("/signup", (req, res) => {
        console.log('req.body:', req.body);
        
        const user = new User(req.body);
        user.save().then((user) => {
            const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: "60 days" });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            return res.json({user});
        }).catch(err => {
            console.log(err.message);
            return res.status(400).send({err});
        });
    });

    // LOGOUT
    app.get('/logout', (req, res) => {
        res.clearCookie('nToken');
        res.json('Logout successful');
    });

    // LOGIN
    app.post("/login", (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        // Find this user name
        User.findOne({ username }, "username password")
        .then(user => {
            if (!user) {
            // User not found
            return res.status(401).send({ message: "Wrong Username or Password" });
            }
            // Check the password
            user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
                // Password does not match
                return res.status(401).send({ message: "Wrong Username or password" });
            }
            // Create a token
            const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
                expiresIn: "60 days"
            });
            // Set a cookie and redirect to root
            res.cookie("nToken", token, { maxAge: 900000, httpOnly: true });
            res.json(user);
            });
        })
        .catch(err => {
            console.log(err);
        });
    });

}