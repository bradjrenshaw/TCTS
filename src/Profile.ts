import ChatService from './chatServices/chatService/ChatService';
import OutputService from './outputServices/outputService';
import DataManager from './DataManager';

export default class Profile {
    name: string;
    outputSettings: any;
    chatService: ChatService | null;
    outputService: OutputService|null;
    readonly dataManager: DataManager;

    constructor(dataManager: DataManager, name: string = "", outputSettings: any | undefined = undefined, chatService: ChatService | null = null, outputService: OutputService|null = null) {
        this.name = name;
        this.dataManager = dataManager;
        this.outputSettings = outputSettings ? outputSettings : {};
        this.chatService = chatService;
        this.outputService = outputService;
    }

    clone(): Profile {
        let profile = new Profile(this.dataManager, this.name, structuredClone(this.outputSettings));
        if (this.chatService) profile.chatService = this.chatService.clone(profile);
        if (this.outputService) profile.outputService = this.outputService.clone();
        return profile;
    }

    serialize(): object {
        return {
            name: this.name,
            outputServiceName: this.outputService ? this.outputService?.name : undefined,
            outputSettings: this.outputSettings,
            chatService: this.chatService ? this.chatService?.serialize() : {}
        };
    }

    getUIErrors(): Array<string> {
        let errors: Array<string> = [];
        if (this.chatService) {
            errors = errors.concat(this.chatService.getUIErrors());
        }
        if (this.outputService) {
            errors = errors.concat(this.outputService.getUIErrors());
        }
        return errors;
    }
};
