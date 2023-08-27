import ChatService from "./ChatService";
import DataManager from "../../DataManager";
import ChatEvent from "../../events/ChatEvent";
import OutputEvent from "../../outputServices/outputServiceProvider/OutputEvent";
import Profile from "../../Profile";


export default abstract class ChatServiceConnection {
    chatService: ChatService;
    profile: Profile;
    readonly dataManager: DataManager;

    constructor(dataManager: DataManager, chatService: ChatService) {
        this.dataManager = dataManager;
        this.chatService = chatService;
        if (this.chatService.profile) {
        this.profile = chatService.profile;
    } else {
        throw new Error("Error: Cannot create chat service connection with no profile on service.");
    }
    }

    abstract connect(): Promise<boolean>;

    abstract disconnect(): Promise<void>;

    abstract isConnected(): boolean;

    abstract processChatEvent(event: ChatEvent, message: any): void;

    processOutputEvent(event: OutputEvent): void {
        event.process();
        this.dataManager.actionQueue.enqueueEvent(event);
    }
}
