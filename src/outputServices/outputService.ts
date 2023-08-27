import DataManager from "../DataManager";
import OutputMessageAction from "../outputActions/OutputMessageAction";
import OutputServiceProvider from "./outputServiceProvider/outputServiceProvider";

export default class OutputService {
    name: string;
    dataManager: DataManager;
    serviceProvider: OutputServiceProvider | null;

    constructor(
        dataManager: DataManager,
        name: string = "",
        serviceProvider: OutputServiceProvider | null = null,
    ) {
        this.dataManager = dataManager;
        this.name = name;
        this.serviceProvider = serviceProvider;
    }

    clone(): OutputService {
        let data = this.serialize();
        return OutputService.deserialize(this.dataManager, data);
    }

    output(action: OutputMessageAction): void {
        if (!this.serviceProvider) return;
        this.serviceProvider.output(action);
    }

    getUIErrors(): Array<string> {
        if (this.serviceProvider) {
            return this.serviceProvider.getUIErrors();
        }
        return [];
    }

    static deserialize(dataManager: DataManager, data: any): OutputService {
        if (!data.name) {
            throw new Error("OutputService missing name field.");
        }
        if (!data.serviceProvider) {
            throw new Error("OutputService missing serviceProvider field.");
        }
        let serviceProviderType: typeof OutputServiceProvider =
            dataManager.providerRegistry.outputServiceProviders[
                data.serviceProvider.name
            ];
        if (!serviceProviderType) {
            throw new Error(
                "Service provider with name " +
                    data.serviceProvider.name +
                    " not found.",
            );
        }
        return new OutputService(
            dataManager,
            data.name,
            serviceProviderType.prototype.deserialize(data.serviceProvider),
        );
    }

    serialize(): any {
        return {
            name: this.name,
            serviceProvider: this.serviceProvider?.serialize(),
        };
    }
}
