const userRepository = require("../repository/userRepository");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {addUser} = require("../repository/userRepository");

async function login(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const result = await userRepository.userExist(username, password);
    if(result[0].length !== 1) {
        return res.status(401).json({ error: 'User does not exist !' });
    }
    if(password !== result[0][0].password) {
        return res.status(401).json({ error: 'Wrong password !' });
    }
    res.status(200).json({
        token: jwt.sign(
            { userId: result[0][0].id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
        )
    });
}

async function signUp(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const result = await userRepository.userExist(username, password);
    if(result[0].length === 1) {
        return res.status(401).json({ error: 'User already exist !' });
    }
    const CryptedPassword = await bcrypt.hash(password, 10)
    const user = {
        Username: username,
        Password: CryptedPassword
    };
    await addUser(user);
    res.status(201).json({ message: 'User created !' });
}

module.exports = {
    login,
    signUp
}