import { createHash, createCipheriv, scryptSync } from 'crypto';

const key = scryptSync('B97590AA3B455230', 'F3D820B2A31EE87D', 32);
const iv = Buffer.from([222, 160, 107, 51, 118, 25, 70, 232, 173, 44, 182, 134, 116, 85, 102, 51]);

function simpleHash(input: string): string {
    return createHash('md5').update(input).digest('hex');
}

function hashWithFixedSalt(input: string): string {
    const hash = createHash('sha256');
    hash.update(input + '56EEA19F56CB20B4');
    return hash.digest('hex');
}

function encrypt(text: string): string {
    const cipher = createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export function hashString(input: string) {
    const hashInput = hashWithFixedSalt(simpleHash(input));
    const word = encrypt(hashInput);

    return word;
}


