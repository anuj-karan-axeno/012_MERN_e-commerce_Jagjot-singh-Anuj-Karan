const express = require('express')
const dotnev = require('dotenv');
const { authRoutes } = require('./routes/authRouter');
dotnev.config({
    quiet: true
});
const app = express();

app.use('/auth', authRoutes)

app.get('/health',(req,res)=>{
    res.status(200).send({
        msg:"Server is healthy :)"
    })
})

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`app listening on port ${port} :)`);
})


