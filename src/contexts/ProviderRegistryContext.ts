import { createContext, useContext } from "react";
import ProviderRegistry from "../ProviderRegistry";


export let ProviderRegistryContext = createContext<ProviderRegistry|null>(null);

export let useProviderRegistryContext = (): ProviderRegistry => {
    let providerRegistry = useContext<ProviderRegistry|null>(ProviderRegistryContext);
    if (!providerRegistry) {
        throw new Error("Cannot use ProviderRegistryContext outside of a context provider.");
    }
    return providerRegistry;
};
