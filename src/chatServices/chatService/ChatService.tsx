import DataManager from "../../DataManager";
import ChatServiceConnection from "./ChatServiceConnection";
import Profile from "../../Profile";

export default abstract class ChatService {
    public readonly name: string = "Undefined";
    protected connection: ChatServiceConnection | null;
    profile: Profile;
    readonly dataManager: DataManager;

    constructor(dataManager: DataManager, profile: Profile) {
        this.dataManager = dataManager;
        this.profile = profile;
        this.connection = null;
    }

    abstract clone(profile: Profile): ChatService;

    isConnected(): boolean {
        let connection = this.getConnection();
        if (connection) {
            return connection.isConnected();
        }
        return false;
    }

    abstract connect(): Promise<ChatServiceConnection>;

    abstract disconnect(): Promise<void>;

    getConnection(): ChatServiceConnection | null {
        return this.connection;
    }

    abstract getUIErrors(): Array<string>;

    abstract ConnectionComponent(): any;

    async sendMessage(message: string): Promise<void> {
        if (!this.isConnected()) return;
        await this.connection?.sendMessage(message);
    }

    abstract deserialize(
        dataManager: DataManager,
        profile: Profile,
        data: any,
    ): ChatService;

    abstract serialize(): object;
}
