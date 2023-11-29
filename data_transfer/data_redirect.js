/* ---My Files--- */
const { handle_adm_signin, handle_adm_signup } = require('./adm/handle_adm_auth');

function data_redirect(unpacked_data) {
    switch (unpacked_data.type) {
        case 'adm_signin':
            return handle_adm_signin(unpacked_data);
        case 'adm_signup':
            return handle_adm_signup(unpacked_data);
        default:
            return "Unable To Redirect Data!";
    }
}

module.exports = { data_redirect };