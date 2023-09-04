import { ChangeEvent, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import OutputService from "../outputServices/outputService";
import OutputServiceProvider from "../outputServices/outputServiceProvider/outputServiceProvider";
import { useProviderRegistryContext } from "../contexts/ProviderRegistryContext";
import useLifecycle from "../hooks/useLifecycle";
import ErrorList from "./ErrorList";

type OnConfirmCallbackType = (service: OutputService) => void;
type OnCancelCallbackType = (service: OutputService) => void;

const NoServiceProvidersError = () => {
    return <p>No output service providers have been registered.</p>;
};

const NoServiceProviderSelectedError = () => {
    return <p>No service provider selected.</p>;
};

const GeneralSettingsTab = ({ service }: { service: OutputService }) => {
    let [serviceName, setServiceName] = useState(service.name);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setServiceName(event.target.value);
        service.name = event.target.value;
    };

    return (
        <>
            <form>
                <label htmlFor="inputName">Name: </label>
                <input
                    id="inputName"
                    type="text"
                    onChange={handleNameChange}
                    value={serviceName}
                />
            </form>
        </>
    );
};

const ServiceSettings = ({
    service,
    onServiceProviderChange,
}: {
    service: OutputService;
    onServiceProviderChange: (
        serviceProvider: OutputServiceProvider | null,
    ) => void;
}) => {
    let [serviceProviderName, setServiceProviderName] = useState<
        string | undefined
    >(service.serviceProvider ? service.serviceProvider.name : undefined);
    let providerRegistry = useProviderRegistryContext();

    useLifecycle(() => {
        if (service.serviceProvider) {
            return;
        }
        let [name, provider] =
            providerRegistry.getDefaultOutputServiceProvider();
        if (!provider) return;
        setOutputServiceProvider(name);
    });

    const setOutputServiceProvider = (name: string | undefined) => {
        if (!name) return;
        let provider: typeof OutputServiceProvider =
            providerRegistry.outputServiceProviders[name];
        if (!provider) {
            //This shouldn't be possible
            console.log("Could not find service provider with name " + name);
            return;
        }
        setServiceProviderName(name);
        service.serviceProvider = Reflect.construct(provider, []);
        onServiceProviderChange(service.serviceProvider);
    };

    const handleServiceNameChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setOutputServiceProvider(event.target.value as string);
    };

    return (
        <>
            <form>
                <select
                    onChange={handleServiceNameChange}
                    value={serviceProviderName}
                >
                    {Object.keys(providerRegistry.outputServiceProviders).map(
                        (name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ),
                    )}
                </select>
            </form>
            {service.serviceProvider ? (
                <service.serviceProvider.ServiceSettingsComponent />
            ) : (
                <NoServiceProvidersError />
            )}
        </>
    );
};

const OutputSettings = ({
    serviceProvider,
}: {
    serviceProvider: OutputServiceProvider | null;
}) => {
    if (serviceProvider) {
        let Component = serviceProvider.OutputSettingsComponent;
        return <Component settings={serviceProvider.outputSettings} />;
    }
    return <NoServiceProviderSelectedError />;
};

const OutputServiceSettings = ({
    originalService,
    editing = false,
    onConfirm,
    onCancel,
}: {
    originalService: OutputService;
    editing?: boolean;
    onConfirm: OnConfirmCallbackType;
    onCancel: OnCancelCallbackType;
}) => {
    let [service, setService] = useState<OutputService>(originalService);
    let [serviceProvider, setServiceProvider] =
            useState<OutputServiceProvider | null>(null);
    let [ errors, setErrors ] = useState<Array<string>>([]);

    useLifecycle(() => {
        if (editing) {
            setService(originalService.clone());
            setServiceProvider(service.serviceProvider);
        } else {
            setServiceProvider(service.serviceProvider);
        }
    });

    const handleServiceProviderChange = (
        serviceProvider: OutputServiceProvider | null,
    ) => {
        setServiceProvider(serviceProvider);
    };

    const handleCancel = () => {
        if (service) onCancel(service);
    };

    const handleConfirm = () => {
        let errorList: Array<string> = [];
        if (!service.name || service.name === "") {
            errorList.push("An output service must have a unique name.");
        }
        if (!service.serviceProvider) {
            errors.push("An output service must have a service provider selected.");
        }

        setErrors(errorList);
        if (errorList.length > 0) {
            return;
        }

        if (service) onConfirm(service);
    };

    if (!service) {
        return <p>Loading</p>;
    }

    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>General</Tab>
                    <Tab>Service Provider</Tab>
                    <Tab>Output Settings</Tab>
                </TabList>
                <TabPanel>
                    <GeneralSettingsTab service={service} />
                </TabPanel>
                <TabPanel>
                    <ServiceSettings
                        service={service}
                        onServiceProviderChange={handleServiceProviderChange}
                    />
                </TabPanel>
                <TabPanel>
                    <OutputSettings serviceProvider={serviceProvider} />
                </TabPanel>
            </Tabs>
            {errors.length > 0 && <ErrorList errors={errors} />}
            <button onClick={handleConfirm}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
        </>
    );
};

export default OutputServiceSettings;
