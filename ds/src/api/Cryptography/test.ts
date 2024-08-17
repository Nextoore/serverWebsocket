import * as crypto from 'crypto';
import * as fs from 'fs';

function encryptWithPublicKey(publicKeyPath: string, data: string): string {
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        buffer
    );
    return encrypted.toString('base64');
}

function decryptWithPrivateKey(privateKeyPath: string, encryptedData: string, passphrase: string): string {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            passphrase: passphrase,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        buffer
    );
    return decrypted.toString('utf8');
}

const publicKeyPath = 'public_key.pem';
const privateKeyPath = 'private_key.pem';
const passphrase = '09126';

const originalData = 'Hello, World!';
console.log('Original Data:', originalData);

const encryptedData = encryptWithPublicKey(publicKeyPath, originalData);
console.log('Encrypted Data:', encryptedData);

try {
    const decryptedData = decryptWithPrivateKey(privateKeyPath, encryptedData, passphrase);
    console.log('Decrypted Data:', decryptedData);
} catch (error) {
    console.error('Error during decryption:', error.message);
}
