import express from 'express'

export const authRoutes = express.Router();

authRoutes.post('/login', (req, res) => {
    res.status(200).send({
        msg: "Success"
    })
})
