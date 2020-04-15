const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors')

server.use(express.json());
server.use(cors());
server.use('/', require('./routes'));

server.listen(process.env.PORT, console.log(`Listening on port: ${process.env.PORT}`));


