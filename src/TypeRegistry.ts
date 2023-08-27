export default class ProviderRegistry<T> {
    providers: { [key: string]: T };
    defaultProviderName: string;
    defaultProvider: T | null;

    constructor() {
        this.providers = {};
        this.defaultProviderName = "";
        this.defaultProvider = null;
    }

    get(name: string): T | undefined {
        return this.providers[name];
    }

    register(
        name: string,
        provider: T,
        isDefaultProvider: boolean = false,
    ): void {
        if (this.providers[name]) {
            throw new Error("A provider " + name + " already exists.");
        }
        this.providers[name] = provider;
        if (!this.defaultProvider || isDefaultProvider) {
            this.setDefaultProvider(name, provider);
        }
    }

    private setDefaultProvider(name: string, provider: T) {
        this.defaultProviderName = name;
        this.defaultProvider = provider;
    }
}
