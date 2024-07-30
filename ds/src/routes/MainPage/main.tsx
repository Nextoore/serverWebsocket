import { createSignal, createEffect } from "solid-js"; 
 
let soscket: WebSocket | undefined; 
 
export default function Home() { 
  const [message, setMessage] = createSignal([]); 
  const [ready, setReady] = createSignal(false); 
  const [user, setUser] = createSignal(''); 
  const [name, setName] = createSignal(''); 
 
  function connection() { 
    soscket = new WebSocket('ws://localhost:5000'); 
 
    soscket.onopen = () => { 
      console.log('Connected'); 
      setReady(true); 
      const message = { 
        event: 'message', 
        user: user(), 
        id: Date.now() 
      }; 
      soscket.send(JSON.stringify(message)); 
    }; 
 
    soscket.onmessage = (event) => { 
      const receivedMessage = JSON.parse(event.data); 
      console.log('Message received:', receivedMessage); 
    }; 
 
    soscket.onerror = (error) => { 
      console.error('WebSocket error:', error); 
    }; 
 
    soscket.onclose = () => { 
      console.log('WebSocket closed'); 
      setReady(false); 
    }; 
  } 
 
  function sendMessage() { 
    if (soscket && soscket.readyState === WebSocket.OPEN) { 
      const message = { 
        user: user(), 
        message: user(), 
        id: Date.now(), 
        event: 'message' 
      }; 
      soscket.send(JSON.stringify(message)); 
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
          <> 
            <input 
              type="text" 
              placeholder='YO, chat' 
              value={user()} 
              onInput={(e) => setUser(e.target.value)} 
            /> 
            <button onClick={connection}>Join</button> 
          </> 
        ) : ( 
          <> 
            <input 
              type="text" 
              placeholder='Enter message' 
              value={user()} 
              onInput={(e) => setUser(e.target.value)} 
              onKeyUp={onKeyUps} 
            /> 
            <button type="button" onClick={sendMessage}> Send</button> 
          </> 
        )} 
    </main> 
  ); 
}

