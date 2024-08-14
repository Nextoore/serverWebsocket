import { createSignal, createEffect } from "solid-js"; 
import s from './main.module.scss';
import { useLocation } from "@solidjs/router";

let socket: WebSocket | undefined;

const SERVER_IP = '185.102.139.56';
const SERVER_PORT = 9999;
const SERVER_URL = `ws://${SERVER_IP}:${SERVER_PORT}`;

export default function Home() { 
  const [message, setMessage] = createSignal<{ chat: string; messages: any[] }[]>([]); 
  const [ready, setReady] = createSignal(false); 
  const [user, setUser] = createSignal(''); 
  const [chatRoom, setChatRoom] = createSignal('');
  const [username, setUsername] = createSignal<string | undefined>(undefined);
  const [users, setUsers] = createSignal<string[]>(['User1', 'User2', 'User3']); 

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const usernameParam = queryParams.get("username");

  if (usernameParam) {
    setUsername(usernameParam);
  }

  function connectToChatRoom(chat: string) { 
    setChatRoom(chat);

    if (socket) {
      socket.close();
    }

    socket = new WebSocket(SERVER_URL); 

    socket.onopen = () => {  
      setReady(true); 
      const msg = { 
        event: 'connection', 
        user: username(), 
        chat: chat, 
        id: Date.now() 
      }; 
      socket.send(JSON.stringify(msg)); 
    }; 

    socket.onmessage = (event) => { 
      const receivedMessage = JSON.parse(event.data);

      if (receivedMessage.event === 'history') {
        setMessage([{ chat: receivedMessage.chat, messages: receivedMessage.messages }]);
      } else {
        setMessage((prevArray) => {
          const existingChat = prevArray.find(chat => chat.chat === receivedMessage.chat);
          if (existingChat) {
            existingChat.messages.push(receivedMessage);
            return [...prevArray.filter(chat => chat.chat !== receivedMessage.chat), existingChat];
          } else {
            return [...prevArray, { chat: receivedMessage.chat, messages: [receivedMessage] }];
          }
        });
      }
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
        user: username(), 
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
    <div class={s.container}>
      <header class={s.header}>
        <div class={s.userInfo}>
          <span>{username()}</span>
          <div class={s.avatar}>
            <img src="" alt="User Avatar"/>
          </div>
        </div>
      </header>
      <div class={s.mainContent}>
        <aside class={s.leftPanel}>
          <h3>Users</h3>
          <ul>
            {users().map(user => (
              <li 
                onClick={() => connectToChatRoom(user)} 
                class={chatRoom() === user ? s.activeChat : ''}
              >
                {user}
              </li>
            ))}
          </ul>
        </aside>
        <section class={s.chatSection}>
          {ready() ? (
            <div class={s.chatContainer}>
              <div class={s.chatBox}>
                {message().map((chat) => (
                  <div key={chat.chat}>
                    {chat.messages.map((mess) => (
                      <div key={mess.id} class={s.message}>
                        {mess.event === 'message'
                          ? <div><strong>{mess.sender}:</strong> {mess.message}</div>
                          : null
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div class={s.messageInput}>
                <input 
                  type="text" 
                  placeholder='Enter message' 
                  value={user()} 
                  onInput={(e) => setUser(e.target.value)} 
                  onKeyUp={onKeyUps} 
                /> 
                <button type="button" onClick={sendMessage} class={s.btn}>Send</button> 
              </div>
            </div>
          ) : (
            <div>
            </div>
          )}
        </section>
      </div>
    </div>
  ); 
}
