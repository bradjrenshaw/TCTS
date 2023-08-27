import ChatService from "./chatServices/chatService/ChatService";
import OutputServiceProvider from "./outputServices/outputServiceProvider/outputServiceProvider";

export default class ProviderRegistry {
    public readonly chatServices: { [key: string]: typeof ChatService };
    public readonly outputServiceProviders: {
        [key: string]: typeof OutputServiceProvider;
    };

    constructor() {
        this.chatServices = {};
        this.outputServiceProviders = {};
    }

    getDefaultChatService(): [
        string | undefined,
        typeof ChatService | undefined,
    ] {
        let key: string = Object.keys(this.chatServices)[0];
        if (!key) {
            return [undefined, undefined];
        }
        let service: typeof ChatService = this.chatServices[key];
        if (!service) {
            return [undefined, undefined];
        }
        return [key, service];
    }

    registerChatService(name: string, service: typeof ChatService): void {
        if (this.chatServices[name]) {
            throw new Error(
                "A chat provider with the name " +
                    name +
                    " already exists. Object is " +
                    this.chatServices[name],
            );
        }
        this.chatServices[name] = service;
    }

    getDefaultOutputServiceProvider(): [
        string | undefined,
        typeof OutputServiceProvider | undefined,
    ] {
        let key: string = Object.keys(this.outputServiceProviders)[0];
        if (!key) {
            return [undefined, undefined];
        }
        let service: typeof OutputServiceProvider =
            this.outputServiceProviders[key];
        if (!service) {
            return [undefined, undefined];
        }
        return [key, service];
    }

    registerOutputServiceProvider(
        name: string,
        provider: typeof OutputServiceProvider,
    ) {
        if (this.outputServiceProviders[name]) {
            throw Error(
                "An output service provider with the name " +
                    name +
                    " already exists.",
            );
        }
        this.outputServiceProviders[name] = provider;
    }

    async initialize(): Promise<void> {
        for (let o of Object.values(this.outputServiceProviders)) {
            await o.initialize();
        }
    }
}
