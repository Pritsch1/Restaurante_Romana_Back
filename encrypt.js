/* ---envs--- */
/* ---Dependencies--- */
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const { type } = require('os');

function create_iv() {
    return crypto.randomBytes(16);
}

function encrypt_data(data, key, iv) {
    try {
        const key_hex = Buffer.from(key, 'hex');
        const cipher = crypto.createCipheriv('aes-256-cbc', key_hex, iv);
        let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    } catch (error) {
        return null;
    }    
}

function decrypt_data(encryptedData, key, iv) {
    try {
        const key_hex = Buffer.from(key, 'hex');
        const iv_string = Buffer.from(iv);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key_hex, iv_string);
        let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

function decrypt_data_react(encryptedData, key, iv) {
    try {
        const key_hex = CryptoJS.enc.Hex.parse(key);
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key_hex, { iv });
        const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

/*const generateRandomKey = () => {
    return crypto.randomBytes(32).toString('hex'); // 32 bytes for AES-256
};

const secureRandomKey = generateRandomKey();
console.log('Secure Random Key:', secureRandomKey);*/

module.exports = { create_iv, encrypt_data, decrypt_data, decrypt_data_react };