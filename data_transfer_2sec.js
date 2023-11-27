/* ---envs--- */
const SEC_IP = process.env.RRSEC_IP;
const SEC_PORT = process.env.RRSEC_PORT;
const WHOAMI = process.env.RRWHOAMI;
const CRYPTOKEY = process.env.RRCRYPTOKEY;
/* ---Dependencies--- */
const net = require('net');
/* ---My Files--- */
const { create_iv, encrypt_data, decrypt_data } = require('./encrypt');

function data_packing(data, type) {
    const iv = create_iv();
    const iv1 = create_iv();
    const iv2 = create_iv();
    const encrypted_data = encrypt_data(data, CRYPTOKEY, iv1);
    const whoami = encrypt_data(WHOAMI, CRYPTOKEY, iv2);
    const data_package = {
        encrypted_data: encrypted_data,
        iv1: iv1,
        whoami: whoami,
        iv2: iv2,
        type: type
    };

    const data_package_encrypted = encrypt_data(data_package, CRYPTOKEY, iv);
    const sealed_data_package = {
        data_package_encrypted: data_package_encrypted,
        iv: iv
    }
    return sealed_data_package;
}

function data_unpacking(data_to_unpack) {
    return new Promise((resolve, reject) => {
        let sealed_data_package = JSON.parse(data_to_unpack);
        const data_package = decrypt_data(sealed_data_package.data_package_encrypted, CRYPTOKEY, sealed_data_package.iv);
        const whoareyou = decrypt_data(data_package.whoami, CRYPTOKEY, data_package.iv2);
        if (whoareyou !== "test") { reject("Unable to Unpack Data @ RRBDT"); }
        else {
            const decrypted_data = decrypt_data(data_package.encrypted_data, CRYPTOKEY, data_package.iv1);
            const data_to_handle = {
                decrypted_data: decrypted_data,
                type: data_package.type
            }
            resolve(data_to_handle);
        }
        reject("error @ RRBDT");
    });
}

function send_data(front_data, type) {
    return new Promise((resolve, reject) => {
        const package = data_packing(front_data, type);
        if (
            !package ||
            typeof package !== 'object' ||
            !package.hasOwnProperty('data_package_encrypted') ||
            !package.hasOwnProperty('iv') ||
            typeof package.data_package_encrypted !== 'string' ||
            typeof package.iv !== 'object'
        ) {
            reject("Invalid data package structure @ RRBDT");
            throw new Error("Invalid data package structure!");
        }

        /* ---create connection--- */
        const socket = net.createConnection(
            { port: SEC_PORT, host: SEC_IP, timeout: 15000 },
            () => {
                console.log("\n-----Socket Opened!-----");
            });
        /* ---connected--- */
        socket.on('connect', () => {
            try {
                socket.write(JSON.stringify(package));            
            } catch (error) {
                reject("Unable to send data @ RRBDT");
                socket.destroy();
            }

        });
        /* ---incomming data--- */
        socket.on('data', (sec_data) => {
            console.log(sec_data);
            /*data_unpacking(sec_data)
                .then((response) => {
                    console.log(response);
                    if (response.type === "success") {
                        socket.end();
                    } else {
                        reject(response.decrypted_data);
                        socket.end();
                    }                    
                })
                .catch((error) => {
                    reject(error);
                    socket.destroy();
                });*/
            /*if (unpacked_data === "Unable to Unpack Data @ RRBDT") {
                reject("Unable to Unpack Data @ RRBDT");
                socket.destroy();
            }
            if (unpacked_data === "error @ RRBDT") {
                reject("error @ RRBDT");
                socket.destroy();
            }*/
            //const validated_data = data_redirect(unpacked_data);
            //console.log('Incomming Data:', received_data);
            //reject("data was received")
            //socket.end();
            /*try {
                const received_data = data_unpacking(sec_data);
                console.log('Incomming Data:', received_data);
                if (received_data.type === "success") {
                    resolve(received_data.message);
                } else if (received_data.type === "error") {
                    reject(received_data.message);
                } else {
                    reject("Unknown Error @ RRBDT");
                }
                socket.end();
            } catch (error) {
                console.log(error);
                reject("Data Corrupted @ RRBDT");
                socket.destroy();
            }*/
        })
        /* ---socket closed--- */
        socket.on('timeout', () => {
            console.log('Socket timed out');
            reject("Connection timed out @ RRBDT");
            socket.destroy();
        });
        socket.on('end', () => {
            console.log('-----Socket Closed!-----\n');
        });
        socket.on('error', (err) => {
            console.error('Error:', err);
            socket.destroy();
            reject("Can't Reach Server @ RRBDT");
        });
    });
}

module.exports = { send_data };