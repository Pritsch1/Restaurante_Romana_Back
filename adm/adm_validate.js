/* ---in--- */
function validate_signin_request(data) {
    if (
        data &&
        typeof data === 'object' &&
        data.hasOwnProperty('email') &&
        data.hasOwnProperty('password') &&
        data.hasOwnProperty('keep_connected') &&
        data.hasOwnProperty('location') &&
        typeof data.email === 'string' &&
        typeof data.password === 'string' &&
        typeof data.keep_connected === 'boolean' &&
        typeof data.location === 'object'
    ) { return true; }
    return false;
}

function validate_signin_response() {

}

/* ---up--- */
function validate_signup_request(data) {
    if (
        data &&
        typeof data === 'object' &&
        data.hasOwnProperty('email') &&
        data.hasOwnProperty('password') &&
        data.hasOwnProperty('phone') &&
        data.hasOwnProperty('location') &&
        typeof data.email === 'string' &&
        typeof data.password === 'string' &&
        typeof data.phone === 'string' &&
        typeof data.location === 'object'
    ) { return true; }
    return false;
}

function validate_signup_response() {

}

module.exports = { validate_signin_request, validate_signup_request };