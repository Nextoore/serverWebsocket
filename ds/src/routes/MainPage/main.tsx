import { log } from 'console';
import styles from './main.module.scss'
import { createEffect } from "solid-js";
import { createSignal } from "solid-js"
import axios from 'axios';
import { Show } from "solid-js";
import { Socket } from 'dgram';
export default function Home() {
  const [message, setMessage] = createSignal([]);
  const [ready, setReady] = createSignal(false)
  const [user, setUser] = createSignal('')
  const [name, setName] = createSignal('')
  

  function connection(){
    const soscket = new WebSocket('ws://localhost:5000')
    
    soscket.onopen = () => {
      console.log('воркает')
      setReady((prev) => prev = true)
      console.log(ready()) 
      const message = {
        event: 'message', user, id: Date.now()
      }
      soscket.send(JSON.stringify(message.user()))
    }
    
    
    soscket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('ворsкает')
    }
    const sendMessage = async () => {
      const message = {
        user, 
        message: user, 
        id: Date.now(),
        event: 'message'
      }
      soscket.send(JSON.stringify(message))
      setUser('')
    }
    
  }

if (ready() == false){
    return(
      <>
        <input type="text" placeholder='YO, chat' value={user()} onChange={(e) => setUser(e.target.value)}/>
        <button onClick={connection}>Join</button>
      </>
    )
}
  function onKeyUps(ev:any){
    const inputik = ev.currentTarget.value
    if (ev.key.toLowerCase() == 'enter'){
      console.log(inputik)
    }

  }
if (ready() == true)  return (
    <main class={styles.wrapper}>
      <div class={styles.header}></div>
        <div class={styles.container}>
          <input type="text" placeholder='Введите сообщение' onKeyUp={onKeyUps}/>
          <button type="submit" class={styles.btn} >Send</button>
        </div>
      
    </main>
  );
}
