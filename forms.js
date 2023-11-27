/* ---envs--- */
const EMAIL = process.env.RREMAIL;
const APIKEY = process.env.RRAPI_KEY;
/* ---Dependencies--- */
const express = require('express');
const router = express.Router();
const { CourierClient } = require("@trycourier/courier");
/* ---uses--- */
const courier = CourierClient({ authorizationToken: `${APIKEY}` });

/* ---catering--- */
router.post('/send_form', (req, res) => {
    const { requestId } = courier.send({
        message: {
            to: {
                email: `${EMAIL}`,
            },
            content: {
                title: `Email de ${req.body.email}`,
                body: `Email: ${req.body.email}\n
                       CEP: ${req.body.zip_value}\n
                       Logradouro: ${req.body.street}\n
                       Numero: ${req.body.address_number},\n
                       Cidade: ${req.body.city}\n
                       UF: ${req.body.state}\n
                       Nome: ${req.body.name}\n
                       Empresa: ${req.body.company_name}\n
                       Refeicoes: ${req.body.meal_quantity}\n
                       Telefone: ${req.body.phone}\n
                       Mensagem: \n${req.body.message}`,
            },
            routing: {
                method: "single",
                channels: ["email"],
            },
        },
    })
        .then(response => {
            res.status(200).send("Email Sent!")
            res.end();
        })
        .catch(error => {
            res.status(424).send("Error @ RRBF")
            res.end();
        });
});

/* ---simple contact--- */
router.post('/contact_send_form', (req, res) => {
    const { requestId } = courier.send({
        message: {
            to: {
                email: `${EMAIL}`,
            },
            content: {
                title: `Mensagem de ${req.body.email}`,
                body: `Email: ${req.body.email}\n\n
                       Nome: ${req.body.name}\n\n
                       Mensagem:\n\n${req.body.message}`
            },
            routing: {
                method: "single",
                channels: ["email"],
            },
        },
    })
        .then(response => {
            res.status(200).send("Email Sent!")
            res.end();
        })
        .catch(error => {
            res.status(424).send("Error @ RRBF")
            res.end();
        });
});

module.exports = router;
