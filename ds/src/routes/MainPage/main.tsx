import { createSignal, createEffect } from "solid-js"; 
import s from './main.module.scss'
let socket: WebSocket | undefined; 
const SERVER_IP = '185.102.139.56';
const SERVER_PORT = 9999;
const SERVER_URL = `ws://${SERVER_IP}:${SERVER_PORT}`

export default function Home() { 
  const [message, setMessage] = createSignal<{ chat: string; messages: any[] }[]>([]); 
  const [ready, setReady] = createSignal(false); 
  const [user, setUser] = createSignal(''); 
  const [chatRoom, setChatRoom] = createSignal('');
  console.log(2)
  function connection() { 
    if (chatRoom() === '') {
      console.log('Chat room is required.');
      return;
    }
    
    socket = new WebSocket(SERVER_URL); 

    socket.onopen = () => { 
      console.log('Connected'); 
      setReady(true); 
      const msg = { 
        event: 'connection', 
        user: user(), 
        chat: chatRoom(), 
        id: Date.now() 
      }; 
      socket.send(JSON.stringify(msg)); 
    }; 

    socket.onmessage = (event) => { 
      const receivedMessage = JSON.parse(event.data); 
      setMessage((prevArray) => {
        const existingChat = prevArray.find(chat => chat.chat === receivedMessage.chat);
        if (existingChat) {
          existingChat.messages.push(receivedMessage);
          return [...prevArray.filter(chat => chat.chat !== receivedMessage.chat), existingChat];
        } else {
          return [...prevArray, { chat: receivedMessage.chat, messages: [receivedMessage] }];
        }
      });
    }; 

    socket.onerror = (error) => { 
      console.error('WebSocket error:', error); 
    }; 

    socket.onclose = () => { 
      console.log('WebSocket closed'); 
      setReady(false); 
    }; 
  } 

  function sendMessage() { 
    if (socket && socket.readyState === WebSocket.OPEN && chatRoom() !== '') { 
      const msg = { 
        user: user(), 
        message: user(), 
        id: Date.now(), 
        event: 'message',
        chat: chatRoom() 
      }; 
      socket.send(JSON.stringify(msg)); 
      setUser(''); 
    } else { 
      console.log('WebSocket is not open or chat room is not specified.'); 
    } 
  } 

  createEffect(() => { 
    if (ready()) { 
      console.log('Ready state changed to true'); 
    } 
  }); 

  function onKeyUps(ev: KeyboardEvent) { 
    if (ev.key === 'Enter') { 
      sendMessage(); 
    } 
  } 
  
  return ( 
    <main>
        {!ready() ? ( 
          <div>
            <input 
              type="text" 
              placeholder='Chatname' 
              value={chatRoom()} 
              onInput={(e) => setChatRoom(e.target.value)} 
            /> 
            <input 
              type="text" 
              placeholder='Enter name' 
              value={user()} 
              onInput={(e) => setUser(e.target.value)} 
            /> 
            <button onClick={connection} class={s.btn}>Join Chat Room</button> 
          </div>
        ) : ( 
          <div>
            <div>
              
            </div>
            <div>
              <input 
                type="text" 
                placeholder='Enter message' 
                value={user()} 
                onInput={(e) => setUser(e.target.value)} 
                onKeyUp={onKeyUps} 
              /> 
              <button type="button" onClick={sendMessage} class={s.btn}> Send</button> 
            </div>
            {message().map((chat) => (
                <div key={chat.chat}>
                  <h2>Chat Room: {chat.chat}</h2>
                  {chat.messages.map((mess) => (
                    <div key={mess.id}>
                      {mess.event === 'connection'
                        ? <div> {mess.user} joined </div>
                        : <div> {mess.message} </div>
                      }
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )} 
    </main> 
  ); 
}




