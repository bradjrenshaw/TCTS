import ChatService from "./chatServices/chatService/ChatService";
import OutputService from "./outputServices/outputService";
import DataManager from "./DataManager";
import UniqueItemList from "./UniqueItemList";

export default class Profile {
    name: string;
    outputSettings: any;
    chatService: ChatService | null;
    outputService: OutputService | null = null;
    readonly dataManager: DataManager;
    outputHistory: UniqueItemList<string>;

    constructor(
        dataManager: DataManager,
        name: string = "",
        outputSettings: any | undefined = undefined,
        chatService: ChatService | null = null,
        outputService: OutputService | null = null,
    ) {
        this.name = name;
        this.dataManager = dataManager;
        this.outputSettings = outputSettings ? outputSettings : {};
        this.chatService = chatService;
        this.setOutputService(outputService);

        //We will need a new ItemList class later
        this.outputHistory = new UniqueItemList<string>(
            [],
            false,
            (a: string, b: string) => false,
        );

        if (!this.outputService) {
            let service = this.dataManager.outputServices.getDefault();
            if (service) this.setOutputService(service);
        }
    }

    clone(): Profile {
        let profile = new Profile(
            this.dataManager,
            this.name,
            structuredClone(this.outputSettings),
        );
        if (this.chatService)
            profile.chatService = this.chatService.clone(profile);
        if (this.outputService)
            profile.outputService = this.outputService.clone();
        let history = [...this.outputHistory];
        profile.outputHistory = new UniqueItemList<string>(
            history,
            false,
            (a: string, b: string) => false,
        );
        return profile;
    }

    serialize(): object {
        return {
            name: this.name,
            outputServiceName: this.outputService
                ? this.outputService?.name
                : undefined,
            outputSettings: this.outputSettings,
            chatService: this.chatService ? this.chatService?.serialize() : {},
        };
    }

    addOutput(message: string): void {
        this.outputHistory.push(message);
    }

    getUIErrors(): Array<string> {
        let errors: Array<string> = [];
        if (this.chatService) {
            errors = errors.concat(this.chatService.getUIErrors());
        } else {
            errors.push("Profile has no chat service set.");
        }
        if (this.outputService) {
            errors = errors.concat(this.outputService.getUIErrors());
        } else {
            errors.push("Profile has no output service set.");
        }
        return errors;
    }

    setOutputService(service: OutputService | null): void {
        if (service && this.outputService !== null) {
            this.outputSettings = structuredClone(
                service.serviceProvider?.outputSettings,
            );
        }
        this.outputService = service;
    }
}
