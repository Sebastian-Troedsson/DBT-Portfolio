const express = require('express');
const server = express();
require('dotenv').config();
const cors = require('cors')

server.use(express.json());
server.use(cors());
server.use('/', require('./routes'));

const PORT = process.env.PORT || 8080;

server.listen(PORT, console.log(`Listening on port: ${PORT}`));


