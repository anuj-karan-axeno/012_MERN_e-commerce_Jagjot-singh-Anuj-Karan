const express = require('express')

const authRoutes = express.Router();

authRoutes.post('/login', (req, res) => {
    res.status(200).send({
        msg: "Success"
    })
})

module.exports = { authRoutes };