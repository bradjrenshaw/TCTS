import { ChangeEvent, useState } from "react";
import ChatService from "../chatService/ChatService";
import ChatServiceConnection from "../chatService/ChatServiceConnection";
import TwitchChatServiceConnection from "./TwitchChatServiceConnection";
import DataManager from "../../DataManager";
import Profile from "../../Profile";

class TwitchChatService extends ChatService {
    public readonly name = "Twitch";
    private username: string;
    private token: string;
    private channel: string;

    constructor(
        dataManager: DataManager,
        profile: Profile,
        username: string = "",
        token: string = "",
        channel: string = "",
    ) {
        super(dataManager, profile);
        this.ConnectionComponent = this.ConnectionComponent.bind(this);
        this.username = username;
        this.token = token;
        this.channel = channel;
    }

    clone(profile: Profile): ChatService {
        let data = this.serialize();
        return TwitchChatService.prototype.deserialize(
            this.dataManager,
            profile,
            data,
        );
    }

    async connect(): Promise<ChatServiceConnection> {
        this.connection = new TwitchChatServiceConnection(
            this.dataManager,
            this,
            this.username,
            this.token,
            this.channel,
        );
        await this.connection.connect();
        return this.connection;
    }

    async disconnect(): Promise<void> {
        let connection = this.getConnection();
        if (connection) {
            connection.disconnect();
        }
        this.connection = null;
    }

    getUIErrors(): Array<string> {
        let errors: Array<string> = [];
        if (!this.username || this.username === "") {
            errors.push("A username for the Twitch chat service is required.");
        }
        if (!this.token || this.token === "") {
            errors.push(
                "An auth token for the Twitch chat service is required.",
            );
        }
        if (this.token.length > 0 && !this.token.startsWith("oauth:")) {
            errors.push("Twitch auth token must include the oauth: prefix.");
        }
        if (!this.channel || this.channel === "") {
            errors.push("A channel for the Twitch chat service is required.");
        }
        if (this.channel.startsWith("#")) {
            errors.push(
                "The chat channel used for the Twitch chat service should not start with #.",
            );
        }
        return errors;
    }

    ConnectionComponent(): any {
        let [username, setUsername] = useState(this.username);
        let [authToken, setAuthToken] = useState(this.token);
        let [channel, setChannel] = useState(this.channel);

        const handleUsernameChanged = (
            event: ChangeEvent<HTMLInputElement>,
        ) => {
            this.username = event.target.value;
            setUsername(this.username);
        };

        const handleAuthTokenChanged = (
            event: ChangeEvent<HTMLInputElement>,
        ) => {
            this.token = event.target.value;
            setAuthToken(this.token);
        };

        const handleChannelChanged = (event: ChangeEvent<HTMLInputElement>) => {
            this.channel = event.target.value;
            setChannel(this.channel);
        };

        return (
            <>
                <form>
                    <label htmlFor="inputUsername">Username: </label>
                    <input
                        id="inputUsername"
                        value={username}
                        onChange={handleUsernameChanged}
                    />
                    <br />
                    <label htmlFor="inputToken">
                        Auth Token/Password (including the auth: prefix):{" "}
                    </label>
                    <input
                        id="inputToken"
                        value={authToken}
                        onChange={handleAuthTokenChanged}
                    />
                    <label htmlFor="inputChannel">Channel: </label>
                    <input
                        id="inputChannel"
                        value={channel}
                        onChange={handleChannelChanged}
                    />
                    <br />
                    <p>
                        An oauth token is required to connect tcts to Twitch.
                        Use <a href="https://twitchapps.com/tmi/">this page</a>{" "}
                        to generate one.
                    </p>
                </form>
            </>
        );
    }

    deserialize(
        dataManager: DataManager,
        profile: Profile,
        data: any,
    ): ChatService {
        return new TwitchChatService(
            dataManager,
            profile,
            data.username,
            data.token,
            data.channel,
        );
    }

    serialize(): object {
        return {
            name: this.name,
            username: this.username,
            token: this.token,
            channel: this.channel,
        };
    }
}

export default TwitchChatService;
