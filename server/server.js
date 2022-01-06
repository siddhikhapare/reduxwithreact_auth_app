const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const {readdirSync} = require("fs");

const app = express() 

mongoose
.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true,
})
.then(() => console.log("DB CONNECTED"))
.catch(error => console.log(`DB CONNECTION ERR ${error}`))

//middlewares
app.use(morgan('dev'));
app.use(express.json({limit:"5mb"}));
app.use(cors());

readdirSync('./routes').map((r) => 
    app.use("/api",require('./routes/' + r))
);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`))

