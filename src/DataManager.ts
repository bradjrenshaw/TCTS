import ActionQueue from "./outputActions/actionQueue";
import ChatService from "./chatServices/chatService/ChatService";
import OutputService from "./outputServices/outputService";
import Profile from "./Profile";
import ProviderRegistry from "./ProviderRegistry";
import UniqueItemListEvent from "./events/UniqueItemListEvent";
import UniqueItemList from "./UniqueItemList";

export default class DataManager {
    outputServices: UniqueItemList<OutputService>;
    profiles: UniqueItemList<Profile>;
    providerRegistry: ProviderRegistry;
    actionQueue: ActionQueue;

    constructor(providerRegistry: ProviderRegistry) {
        this.providerRegistry = providerRegistry;
        this.outputServices = new UniqueItemList<OutputService>();
        this.profiles = new UniqueItemList<Profile>();
        this.actionQueue = new ActionQueue(this);
        this.handleProfilesChange = this.handleProfilesChange.bind(this);
        this.handleOutputServicesChange =
            this.handleOutputServicesChange.bind(this);
        this.handleOutputServicesRemove =
            this.handleOutputServicesRemove.bind(this);
        this.handleOutputServicesReplace =
            this.handleOutputServicesReplace.bind(this);
        this.profiles.addEventListener(
            "change",
            this.handleProfilesChange as EventListener,
        );
        this.outputServices.addEventListener(
            "change",
            this.handleOutputServicesChange as EventListener,
        );
        this.outputServices.addEventListener(
            "remove",
            this.handleOutputServicesRemove as EventListener,
        );
        this.outputServices.addEventListener(
            "replace",
            this.handleOutputServicesReplace as EventListener,
        );
    }

    addProfile(profile: Profile): void {
        for (let p of this.profiles) {
            if (p.name === profile.name) {
                throw new Error(
                    "A chat profile with the name " +
                        profile.name +
                        " already exists.",
                );
            }
        }
        this.profiles.push(profile);
    }

    private addProfileFromData(data: any): void {
        let profileName = data.name;
        let outputSettings = data.outputSettings;
        let chatServiceData = data.chatService;
        let outputService = null;
        if (data.outputServiceName) {
            for (let s of this.outputServices) {
                if (s.name === data.outputServiceName) {
                    outputService = s;
                    break;
                }
            }
        }

        let profile = new Profile(this, profileName, outputSettings);

        if (chatServiceData && Object.keys(chatServiceData).length > 0) {
            let chatServiceType: typeof ChatService =
                this.providerRegistry.chatServices[chatServiceData.name];
            if (!chatServiceType) {
                throw Error(
                    "Chat service " +
                        chatServiceData.name +
                        " could not be found.",
                );
            }
            profile.chatService = chatServiceType.prototype.deserialize(
                this,
                profile,
                chatServiceData,
            );
        }

        this.addProfile(profile);
    }

    public removeProfile(profile: Profile): void {
        this.profiles.remove(profile);
    }

    public replaceProfile(original: Profile, replacement: Profile): boolean {
        return this.profiles.replace(original, replacement);
    }

    public addOutputService(service: OutputService) {
        for (let s of this.outputServices) {
            if (s.name === service.name) {
                throw new Error(
                    "An output service with the name " +
                        s.name +
                        " already exists.",
                );
            }
        }
        this.outputServices.push(service);
    }

    public removeOutputService(service: OutputService): void {
        this.outputServices.remove(service);
    }

    public replaceOutputService(
        original: OutputService,
        replacement: OutputService,
    ): boolean {
        return this.outputServices.replace(original, replacement);
    }

    private handleProfilesChange(event: UniqueItemListEvent<Profile>): void {
        this.saveData();
    }

    private handleOutputServicesChange(
        event: UniqueItemListEvent<Profile>,
    ): void {
        this.saveData();
    }

    private handleOutputServicesRemove(
        event: UniqueItemListEvent<OutputService>,
    ): void {
        let item = event.items[0];
        for (let p of this.profiles) {
            if (p.outputService === item) {
                p.setOutputService(null);
            }
        }
    }

    private handleOutputServicesReplace(
        event: UniqueItemListEvent<OutputService>,
    ): void {
        const [oldItem, newItem] = event.items;
        for (let p of this.profiles) {
            if (p.outputService === oldItem) {
                p.setOutputService(newItem);
            }
        }
    }

    public loadData(): void {
        let data = localStorage.getItem("tcts2");
        if (data) {
            let parsedData = JSON.parse(data);
            console.log("Load data parsed");
            console.log(parsedData);
            this.deserializeInPlace(parsedData);
        }
    }

    public saveData(): void {
        let data = JSON.stringify(this.serialize());
        localStorage.setItem("tcts2", data);
    }

    private deserializeInPlace(data: any): void {
        if (data.outputServices) {
            for (let s of data.outputServices) {
                let service: OutputService = OutputService.deserialize(this, s);
                this.addOutputService(service);
            }
        } else {
            console.warn("outputServices field missing from saved tcts data.");
        }
        if (data.profiles) {
            for (let p of data.profiles) {
                this.addProfileFromData(p);
            }
        } else {
            console.warn("Profiles field  missing from saved tcts data.");
        }
    }

    private serialize(): any {
        return {
            outputServices: this.outputServices.map((service: OutputService) =>
                service.serialize(),
            ),
            profiles: this.profiles.map((profile: Profile) =>
                profile.serialize(),
            ),
        };
    }

    async initialize(): Promise<void> {
        await this.providerRegistry.initialize();
    }
}
