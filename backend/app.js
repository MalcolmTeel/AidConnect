const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors({origin: true, credentials: true}));
app.options('*', cors());

require('dotenv/config');
const api = process.env.API_URL;

const usersRouter = require('./routes/users');
const aidrequestsRouter = require('./routes/aidrequests');

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//Routers
app.use(`${api}/users`, usersRouter);
app.use(`${api}/aidrequests`, aidrequestsRouter);

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'aidconnect-database',
})
.then(()=>{
  console.log("Database Connection is ready...");
})
.catch((err)=>{
  console.log(err)
})

app.listen(3000, () => {
  console.log("Server is running http://localhost:3000");
})