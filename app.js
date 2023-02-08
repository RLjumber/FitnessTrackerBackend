require("dotenv").config()
const express = require("express")
const app = express()
const apiRouter = require('./api')

// Setup your Middleware and API Router here

const morgan = require("morgan")
app.use(morgan('dev'));

app.use('/api',apiRouter)

app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

app.get('/', (req, res) =>{
    res.send()
    })

module.exports = app;
