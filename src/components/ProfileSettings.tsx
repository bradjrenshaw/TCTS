import { ChangeEvent, useState } from "react";
import Profile from "../Profile";
import OutputService from "../outputServices/outputService";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useDataContext } from "../contexts/DataContext";
import DataManager from "../DataManager";
import { useProviderRegistryContext } from "../contexts/ProviderRegistryContext";
import useLifecycle from "../hooks/useLifecycle";
import ErrorList from "./ErrorList";

const ChatSettingsNoServicesError = () => {
    return <p>No chat services have been registered.</p>;
}

const ChatSettingsTab = ({profile}: {profile: Profile}) => {
    let data: DataManager = useDataContext();
    let [chatServiceName, setChatServiceName ] = useState<string | undefined>(profile.chatService ? profile.chatService.name : undefined);
    let providerRegistry = useProviderRegistryContext();

    useLifecycle(() => {
        if (profile.chatService) return;
        let name = chatServiceName;
        if (!name) {
            name = Object.keys(providerRegistry.chatServices)[0];
        }
        setProfileService(name);
    });

    const setProfileService = (name: string|undefined) => {
        if (!name) return;
        let service = providerRegistry.chatServices[name];
        setChatServiceName(name);
        profile.chatService = Reflect.construct(service, [data, profile]);
    };

    const handleServiceNameChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setProfileService(event.target.value);
    };

        return <>
    <select value={chatServiceName} onChange={handleServiceNameChange}>
    {Object.keys(providerRegistry.chatServices).map((name) => <option key={name} value={name}>{name}</option>)}
    </select>
    {profile.chatService ? <profile.chatService.ConnectionComponent/> : <ChatSettingsNoServicesError />}
    </>
};

const GeneralSettingsTab = ({profile}: {profile: Profile}) => {
    let [profileName, setProfileName ] = useState(profile.name);

    const handleProfileNameChange = (event: React.ChangeEvent) => {
        profile.name = (event.target as HTMLInputElement).value;
        setProfileName(profile.name);
        };

    return <>
    <form>
        <label htmlFor="inputProfileName">Profile name: </label>
            <input id="inputProfileName" type="text" value = {profileName} onChange={handleProfileNameChange}/>
    </form>
    </>
}

const OutputSettingsTab = ({profile}: {profile: Profile}) => {
    let data = useDataContext();
    let [ outputServiceName, setOutputServiceName ] = useState<string|undefined>(profile.outputService ? profile.outputService.name: undefined);
    let [ outputService, setOutputService ] = useState<OutputService|null>(profile.outputService);

    useLifecycle(() => {
        if (!profile.outputService) {
            if (data.outputServices.length <= 0) return;
            let service = data.outputServices.getDefault();
            if (service) {
            setOutputServiceName(service.name);
            setOutputService(service);
            profile.outputService = service;
            if (service.serviceProvider) {
                profile.outputSettings = {...service.serviceProvider.outputSettings};
            }
            }
        }
    });

    const setOutputServiceFromString = (name: string) => {
        for (let s of data.outputServices) {
            if (s.name === name) {
                setOutputServiceName(s.name);
                setOutputService(s);
                profile.outputService = s;
            }
        }
    };

    const handleOutputServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOutputServiceFromString(event.target.value);
    };

    return <>
    <label htmlFor="inputOutputService">Output Service</label>
    <select value={outputServiceName} onChange={handleOutputServiceChange}>
        {data.outputServices.map((service: OutputService) => <option value={service.name} key={service.name}>{service.name}</option>)}
    </select>
    <br/>
    {outputService?.serviceProvider && <outputService.serviceProvider.OutputSettingsComponent key={outputServiceName} settings={profile.outputSettings}/>}
    </>
}

const ProfileSettings = ({originalProfile, editing = false, onConfirm, onCancel}: {originalProfile: Profile, editing?: boolean, onConfirm: any, onCancel: any}) => {
    let [ profile, setProfile ] = useState<Profile>(originalProfile);
    let [ errors, setErrors ] = useState<Array<string>>([]);
    let data = useDataContext();

    useLifecycle(() => {
        if (editing) {
            setProfile(originalProfile.clone());
        }
    });

    const handleCancel = () => {
        if (onCancel) onCancel(profile);
    };

    const handleConfirm = () => {
        let errorList: Array<string> = [];
        if (!profile?.name || profile.name.length <= 0) {
            errorList.push("Each profile must have a unique name.");
        } else if ((profile === originalProfile || profile.name !== originalProfile.name) && data.profiles.filter((p: Profile) => p.name === profile.name).length > 0) {
            errorList.push("A profile with name " + profile.name + " already exists.");
        }
        errorList = errorList.concat(profile.getUIErrors());
        if (errorList.length === 0 && onConfirm) onConfirm(profile);
        else setErrors(errorList);
    };

    if (!profile) {
        return <p>Loading.</p>;
    }

    return <>
    <Tabs>
        <TabList>
            <Tab>General</Tab>
            <Tab>Chat</Tab>
            <Tab>Output Settings</Tab>
        </TabList>
        <TabPanel>
    <GeneralSettingsTab profile={profile} />
    </TabPanel>
    <TabPanel>
        <ChatSettingsTab profile={profile}/>
    </TabPanel>
    <TabPanel>
        <OutputSettingsTab profile={profile} />
    </TabPanel>
    </Tabs>
    {errors.length > 0 && <ErrorList errors={errors} />}
    <button onClick={handleConfirm}>Save</button>
    <button onClick={handleCancel}>Cancel</button>
    </>
};

export default ProfileSettings;