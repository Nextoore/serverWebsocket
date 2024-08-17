import * as crypto from 'crypto';
import * as fs from 'fs';

const key = crypto.scryptSync('B97590AA3B455230', 'F3D820B2A31EE87D', 32);
const iv = Buffer.from([222, 160, 107, 51, 118, 25, 70, 232, 173, 44, 182, 134, 116, 85, 102, 51]);

const publicKeyPath = 'public_key.pem';
const privateKeyPath = 'private_key.pem';
const passphrase = '09126';

function simpleHash(input: string): string {
    return crypto.createHash('md5').update(input).digest('hex');
}

function hashWithFixedSalt(input: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(input + '56EEA19F56CB20B4');
    return hash.digest('hex');
}

function encrypt(text: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export function hashString(input: string) {
    const hashInput = hashWithFixedSalt(simpleHash(input));
    const word = encrypt(hashInput);

    return word;
}

export function encryptWithPublicKey(data: string): string {
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

export function decryptWithPrivateKey(encryptedData: string): string {
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





