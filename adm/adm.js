/* ---envs--- */
const BCDKEY = process.env.RRBCDKEY;
const REACT_CRYPTOKEY = process.env.RRREACT_APP_CRYPTOKEY;
/* ---Dependencies--- */
const express = require('express');
const router = express.Router();
//const cookie = require('cookie');
/* ---My Files--- */
const { send_data } = require('.././data_transfer/data_transfer_2sec');
const { create_iv, encrypt_data, decrypt_data, decrypt_data_react } = require('.././encrypt');
const { validate_signin_request, validate_signup_request } = require('./adm_validate');

/* ---in--- */
router.post('/receive_signin', async (req, res) => {
    const front_data = decrypt_data_react(req.body.data, REACT_CRYPTOKEY, req.body.iv);
    if (validate_signin_request(front_data) === true) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject('Connection timed out @ RRBA');
            }, 20000);
        });

        Promise.race([send_data(front_data, "adm_signin"), timeoutPromise])
            .then((response) => { //handle lack of data here

                res.status(200).send(response);
                res.end();
            })
            .catch((error) => {
                console.log(error);
                let my_error = error;
                if (typeof error !== 'string') {
                    my_error = "?"
                }                
                res.status(500).send(my_error);
                res.end();
            });
    } else {
        res.status(400).send("Missing Signin Data @ RRBA");
    }
});

/* ---up--- */
router.post('/receive_signup', async (req, res) => {
    const front_data = decrypt_data_react(req.body.data, REACT_CRYPTOKEY, req.body.iv);
    if (validate_signup_request(front_data) === true) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject('Connection timed out @ RRBA');
            }, 20000);
        });

        Promise.race([send_data(front_data, "adm_signup"), timeoutPromise])
            .then((response) => { //handle lack of data here

                res.status(200).send(response);
                res.end();
            })
            .catch((error) => {
                console.log(error);
                let my_error = error;
                if (typeof error !== 'string') {
                    my_error = "?"
                }
                res.status(500).send(my_error);
                res.end();
            });
    } else {
        res.status(400).send("Missing Signup Data @ RRBA");
    }
});

module.exports = router;


/*
res.setHeader("Access-Control-Allow-Origin", "https_//localhost:3000")
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Max-Age", "1800");
res.setHeader("Access-Control-Allow-Headers", "content-type");
res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

res.setHeader(
                    'Set-Cookie',
                    cookie.serialize('jwtTokenn', response, {
                        httpOnly: true,
                        maxAge: 3600, // Set the expiration time in seconds
                        sameSite: 'none', // Recommended for preventing CSRF
                        secure: true, // Recommended for HTTPS
                        path: '/', // The path where the cookie is accessible
                    })
                );
*/