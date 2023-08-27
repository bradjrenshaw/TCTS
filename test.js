import { Chat, ChatEvents } from "twitch-js";

let username = "chaosbringer216";
let token = "oauth:2bzi5lds3bpmyan73i6vp8fjs2lp8w";
let channel = "chaosbringer216";

async function run() {
    let chat = new Chat({ username: username, token: token });
    await chat.connect();
    await chat.join(channel);
    chat.on(ChatEvents.ALL, (message) => {
        console.log(message);
    });
}

run();
