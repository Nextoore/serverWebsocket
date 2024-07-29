"use server";
import { redirect } from "@solidjs/router";
import { useSession } from "vinxi/http";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { Users } from "../../drizzle/schema";
import * as net from 'net';
import { resolve } from "path";
import { rejects } from "assert";

const SERVER_IP = '127.0.0.1';
const SERVER_PORT = 5555;

function boolBuffer(buffer: Buffer): boolean{
  return buffer.readUInt8(0) === 1;
}

async function sendData(Type: string, username: string, password: string) {
  return new Promise<void>((resolve, reject) => {
    const client = new net.Socket();

    client.connect(SERVER_PORT, SERVER_IP,() => {
      const message = `${Type} ${username} ${password}`
      client.write(message);
    });

    client.on('data', (data: Buffer) =>{
      const response = boolBuffer(data);
      console.log(`server replied: ${response}`)

      if(response == false){
        console.log('Negative response from the server');
      }else{
        client.destroy();
        resolve
      }
    });

    client.on('error', (err) => {
      console.error(`Error: ${err.message}`);
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

  if (!/[!@#$%^&*]/.test(trimPassword)) {
    return `Password must contain at least one special character (!@#$%^&*)`;
  }
}

async function login(username: string, password: string) {
  const user = db.select().from(Users).where(eq(Users.username, username)).get();
  if (!user || password !== user.password) throw new Error("Invalid login");
  return user;
}

async function register(username: string, password: string) {
  const existingUser = db.select().from(Users).where(eq(Users.username, username)).get();
  if (existingUser) throw new Error("User already exists");
  return db.insert(Users).values({ username, password }).returning().get();
}


export async function postToServer(formData: FormData){
  const username = String(formData.get("username"))
  const password = String(formData.get("password"));
  const loginType = String(formData.get("loginType"));

  let error = validateUsername(username) || validatePassword(password);

  try{
    sendData(loginType, username, password);

  }catch(err){
    return err as Error;
  }
}

function getSession() {
  return useSession({
    password: process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace"
  });
}

export async function logout() {
  const session = await getSession();
  await session.update(d => (d.userId = undefined));
  throw redirect("/login");
}

export async function getUser() {
  const session = await getSession();
  const userId = session.data.userId;
  if (userId === undefined) throw redirect("/login");

  try {
    const user = db.select().from(Users).where(eq(Users.id, userId)).get();
    if (!user) throw redirect("/login");
    return { id: user.id, username: user.username };
  } catch {
    throw logout();
  }
}
