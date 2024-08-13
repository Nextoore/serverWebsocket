"use server";
import { redirect } from "@solidjs/router";
import * as net from 'net';
import { hashString } from "./crypt";
import { sendVerificationCode } from "./SendEmail";

const SERVER_IP = 'localhost';
const SERVER_PORT = 5555;

function boolBuffer(buffer: Buffer): boolean {
  return buffer.readUInt8(0) === 1;
}

async function sendData(type: string, email: string, password: string, nickname: string = '0'): Promise<boolean | string> {
  return new Promise<boolean | string>((resolve, reject) => {
    const client = new net.Socket();
    password = hashString(password);

    client.connect(SERVER_PORT, SERVER_IP, () => {
      let message: string;
      if (type === 'register') {
        message = `${type} ${email} ${password} ${nickname}`;
      } else {
        message = `${type} ${email} ${password}`;
      }
      client.write(message);
    });

    client.on('data', (data: Buffer) => {
      const response = boolBuffer(data);
      console.log(`Server replied: ${response}`);

      client.destroy();

      if (response) {
        if (type === 'get') {
          client.on('data', (data: Buffer) => {
            const username = data.toString();
            resolve(username);
          });
        } else {
          resolve(true);
        }
      } else {
        console.log('Negative response from the server');
        resolve(false);
      }
    });

    client.on('error', (err) => {
      console.error(`Error: ${err.message}`);
      client.destroy();
      reject(err);
    });

    client.on('close', () => {
      console.log('Connection closed');
    });
  });
}

function validateUsername(username: unknown) {
  if (typeof username !== "string") {
    return `Username must be a string`;
  }

  const trimUsername = username.trim();
  if (trimUsername.length < 3 || trimUsername.length > 20) {
    return `Usernames must be between 3 and 20 characters long`;
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(trimUsername)) {
    return `Usernames can only contain letters, numbers, and underscores and cannot start with a number`;
  }

  return null; // No error
}

function validatePassword(password: unknown) {
  if (typeof password !== "string") {
    return `Passwords must be a string`;
  }

  const trimPassword = password.trim();
  if (trimPassword.length < 6 || trimPassword.length > 20) {
    return `Passwords must be between 6 and 20 characters long`;
  }

  if (!/[A-Z]/.test(trimPassword)) {
    return `Password must contain at least one uppercase letter`;
  }

  if (!/[0-9]/.test(trimPassword)) {
    return `Password must contain at least one digit`;
  }

  return null; // No error
}

function validateEmail(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return `Email is not valid`;
  }

  return null; // No error
}

export async function postToServer(formData: FormData) {
  const email = String(formData.get("mail"));
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));
  const nickname = String(formData.get("username"));

  const code = await sendVerificationCode(email);

  let error = validateEmail(email) || validatePassword(password);
  if (error) return new Error(error);

  try {
    if (loginType === 'register') {
      error = validateUsername(nickname);
      if (error) return new Error(error);
      
      const result = await sendData(loginType, email, password, nickname);
      if (result === true) {
        throw redirect(`/MainPage/main?username=${encodeURIComponent(nickname)}`);
      }

    } else {
      const result = await sendData(loginType, email, password);
      if (result === true) {
        const user = await sendData("get", email, password) as string;
        if (user) {
          throw redirect(`/MainPage/main?username=${encodeURIComponent(user)}`);
        }
      }
    }
  } catch (err) {
    return err as Error;
  }
}
