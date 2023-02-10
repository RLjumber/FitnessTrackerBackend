require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
const morgan = require('morgan');
const apiRouter = require('./api')

// Setup your Middleware and API Router here

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({extended: true}))

app.use(cors())

app.use('/api', apiRouter)

app.use((error, req, res, next) => {
  if (error) {
    res.send({
      ...error
    })
  }
  next();
})

app.get('*', (req, res) => {
    res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
  });
  

module.exports = app;