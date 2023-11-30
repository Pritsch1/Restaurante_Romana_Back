/* ---envs--- */
require('dotenv').config();
const NODEENV = process.env.RRNODE_ENV;
const EXPRESS_PORT = process.env.RREXPRESS_PORT;
/* ---Dependencies--- */
const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
/* ---My Files--- */
const forms = require('./forms');
const adm = require('./adm/adm');
/* --- rate limitting --- */
const limit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 500, // 100 requests per minute
});
/* ---uses--- */
const app = express();
app.use(express.json());
app.use(cookieParser());
//app.use(cors());


/* DELETE !!!!!!!!!! */
//Dev Only
const corsOptions = { 
    origin: 'https://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));


/* --- file routing --- */
app.use('/forms', limit, forms);
app.use('/adm', limit, adm);
/* --- Express --- */
app.listen(EXPRESS_PORT, () => {
    console.log(`Express Server Running!`);
}).setTimeout(25000);//set to 20000, > socket.on connect