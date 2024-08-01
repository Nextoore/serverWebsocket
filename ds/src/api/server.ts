"use server";
import { redirect } from "@solidjs/router";
import * as net from 'net';

const SERVER_IP = 'localhost';
const SERVER_PORT = 5555;

function boolBuffer(buffer: Buffer): boolean{
  return buffer.readUInt8(0) === 1;
}

async function sendData(Type: string, username: string, password: string, mail: string = '0', date: string = '0', nickname: string = '0'): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const client = new net.Socket();

    client.connect(SERVER_PORT, SERVER_IP, () => {
      if (Type = 'register'){
        const message = `${Type} ${username} ${password} ${nickname} ${date} ${mail}`;
        client.write(message);
      }else{
        const message = `${Type} ${username} ${password}`;
        client.write(message);
      }
    });

    client.on('data', (data: Buffer) => {
      const response = boolBuffer(data);
      console.log(`Server replied: ${response}`);

      client.destroy();

      if (!response) {
        console.log('Negative response from the server');
        resolve(false);  
      } else {
        resolve(true);   
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
  if (trimUsername.length < 3 || trimUsername.length > 20){
    return `Usernames must be between 3 and 20 characters long`;
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(trimUsername)){
    return `Usernames can only contain letters, numbers, and underscores and cannot start with a number`;
  }

}

function validatePassword(password: unknown) {
  if (typeof password !== "string") {
    return `Passwords must be a string`;
  }

  const trimPassword = password.trim();
  if (trimPassword.length < 6 || trimPassword.length > 20){
    return `Passwords must be between 6 and 20 characters long`;
  }

  if (!/[A-Z]/.test(trimPassword)){
    return`Password must contain at least one uppercase letter`;
  }

  if (!/[0-9]/.test(trimPassword)){
    return`Password must contain at least one digit`;
  }
}


export async function postToServer(formData: FormData){
  const username = String(formData.get("username"))
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));

  let error = validateUsername(username) || validatePassword(password);
  if (error) return new Error(error);

  try{
    if (loginType == 'register'){
      const nickname = String(formData.get("nickname"))
      const mail = String(formData.get("mail"));
      const day = String(formData.get("day"));
      const month = String(formData.get("month"));
      const year = String(formData.get("year"));
      const date = `${day}.${month}.${year}`;
      console.log(`${nickname}, ${mail}, ${date}`);

      const result = await sendData(loginType, username, password, mail, date, nickname);

      if (result){
        throw redirect("/MainPage/main");
      }

    }else{

      const result = await sendData(loginType, username, password);

      if (result){
        throw redirect("/MainPage/main");
      }
    }
    
  }catch(err){
    return err as Error;
  }
}




