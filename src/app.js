require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDatabase = require('../database/dbConnect');
// const routes = require('./routes');
const user = require('./routes/routes-controler/user');
const inOut = require('./routes/routes-controler/inOutRoutes');
const monthReport = require('./routes/routes-controler/reportRoutes');
const app = express();

// Connect to the database
connectDatabase();

app.use(bodyParser.json());


app.use('/', user);
app.use('/', inOut);
app.use('/', monthReport);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
