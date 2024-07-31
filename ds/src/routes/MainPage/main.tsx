import { createSignal, createEffect } from "solid-js"; 

let socket: WebSocket | undefined; 
const SERVER_IP = '185.102.139.56';
const SERVER_PORT = 9999;
const SERVER_URL = `ws://${SERVER_IP}:${SERVER_PORT}`

export default function Home() { 
  const [message, setMessage] = createSignal<string[]>([]); 
  const [ready, setReady] = createSignal(false); 
  const [user, setUser] = createSignal(''); 

  function connection() { 
    socket = new WebSocket(SERVER_URL); 

    socket.onopen = () => { 
      console.log('Connected'); 
      setReady(true); 
      const msg = { 
        event: 'connection', 
        user: user(), 
        id: Date.now() 
      }; 
      socket.send(JSON.stringify(msg)); 
    }; 

    socket.onmessage = (event) => { 
      const receivedMessage = JSON.parse(event.data); 
      setMessage((prevArray) => [...prevArray, receivedMessage]);
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
    if (socket && socket.readyState === WebSocket.OPEN) { 
      const msg = { 
        user: user(), 
        message: user(), 
        id: Date.now(), 
        event: 'message' 
      }; 
      socket.send(JSON.stringify(msg)); 
      setUser(''); 
    } else { 
      console.log('WebSocket is not open.'); 
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
              placeholder='YO, chat' 
              value={user()} 
              onInput={(e) => setUser(e.target.value)} 
            /> 
            <button onClick={connection}>Join</button> 
          </div>
        ) : ( 
          <div>
            <div>
              {message().map((mess) => (
                <div key={mess.id}>
                  {mess.event === 'connection'
                    ? <div> {mess.user} joined </div>
                    : <div> {mess.message} </div>
                  }
                </div>
              ))}
            </div>
            <div>
              <input 
                type="text" 
                placeholder='Enter message' 
                value={user()} 
                onInput={(e) => setUser(e.target.value)} 
                onKeyUp={onKeyUps} 
              /> 
              <button type="button" onClick={sendMessage}> Send</button> 
            </div>
          </div>
        )} 
    </main> 
  ); 
}



