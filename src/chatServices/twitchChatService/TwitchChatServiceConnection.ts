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

    constructor(
        dataManager: DataManager,
        service: ChatService,
        username: string,
        authToken: string,
        channel: string,
    ) {
        super(dataManager, service);
        this.username = username;
        this.authToken = authToken;
        this.channel = channel;
        this.chat = new Chat({
            username: this.username,
            token: this.authToken,
        });
        this.connected = false;
        this.receivedEvent = this.receivedEvent.bind(this);
    }

    async connect(): Promise<boolean> {
        await this.chat.connect();
        await this.chat.join(this.channel);
        this.connected = true;
        this.chat.on(ChatEvents.ALL, this.receivedEvent);
        return true;
    }

    async disconnect(): Promise<void> {
        await this.chat.disconnect();
        this.chat.off(ChatEvents.ALL, this.receivedEvent);
        this.connected = false;
    }

    isConnected(): boolean {
        return this.connected;
    }

    processChatEvent(event: ChatEvent, message: any): void {
        this.processOutputEvent(new OutputEvent(this.profile, event, message));
    }

    async sendMessage(message: string): Promise<void> {
        await this.chat.broadcast(message);

        //An incredibly hacky workaround for an issue with tmi.js, should be changed later
        let chatEvent = new ChatEvent(
            null,
            "all",
            (event: OutputEvent) => [
                new OutputMessageAction(this.profile, event),
            ],
            (message: any) => {
                return {
                    text: this.username + ": " + message
                };
            },
        );
        this.processChatEvent(chatEvent, message);
    }

    receivedEvent(message: any): void {
        let chatEvent = new ChatEvent(
            null,
            "all",
            (event: OutputEvent) => [
                new OutputMessageAction(this.profile, event),
            ],
            (message: any) => {
                return {
                    text: message.tags.displayName && message.message
                        ? message.tags.displayName + ": " + message.message
                        : undefined,
                };
            },
        );
        this.processChatEvent(chatEvent, message);
    }
}
