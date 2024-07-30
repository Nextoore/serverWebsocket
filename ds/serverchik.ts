import { client } from "process";

const ws = require('ws');
const wss = new ws.Server({
    port: 5000, 
}, () => console.log('works on port 5000'))

wss.on('connection', function connection(ws:any) {
    ws.on('message', function(message:any){
        message = JSON.parse(message);
        console.log(message)
        switch (message.event){
            case 'message':
                broadcast(message)
                break;
            case 'connection':
                broadcast(message)
                break;
        }
    })
})

function broadcast(message){
    wss.client.forEach(client => {
        client.send(message)
    })
}