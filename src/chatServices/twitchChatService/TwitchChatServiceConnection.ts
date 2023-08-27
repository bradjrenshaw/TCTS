import DataManager from "../../DataManager";
import ChatEvent from "../../events/ChatEvent";
import ChatService from "../chatService/ChatService";
import ChatServiceConnection from "../chatService/ChatServiceConnection";
import { Chat, ChatEvents } from "twitch-js";
import OutputEvent from "../../outputServices/outputServiceProvider/OutputEvent";
import OutputMessageAction from "../../outputActions/OutputMessageAction";

export default class TwitchChatServiceConnection extends ChatServiceConnection {
private username: string;
private authToken: string;
private channel: string;
private chat: Chat;
    private connected: boolean;

constructor(dataManager: DataManager,service: ChatService, username: string, authToken: string, channel: string) {
    super(dataManager, service);
    this.username = username;
    this.authToken = authToken;
    this.channel = channel;
    this.chat = new Chat({username: this.username, token:this.authToken});
    this.connected = false;
}

    async connect(): Promise<boolean> {
        await this.chat.connect();
        await this.chat.join(this.channel);
                this.connected = true;
        this.chat.on(ChatEvents.ALL, (message) => {
            let chatEvent = new ChatEvent(null, "all", (event: OutputEvent) => [new OutputMessageAction(this.profile, event)], (message: any) => {
                return {
                    text: message.tags.displayName ? message.tags.displayName + ": " + message.message : undefined
                };
            });
            this.processChatEvent(chatEvent, message);
        })
        return true;
    }

    async disconnect(): Promise<void> {
        await this.chat.disconnect();
        this.connected = false;
    }

    isConnected(): boolean {
        return this.connected;
    }

    processChatEvent(event: ChatEvent, message: any): void {
        this.processOutputEvent(new OutputEvent(this.profile, event, message));
    }
};
