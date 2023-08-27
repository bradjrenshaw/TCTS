import { useState } from "react";
import "./App.css";
import AppContainer from "./components/AppContainer";
import DataManager from "./DataManager";
import { DataContext } from "./contexts/DataContext";
import ProviderRegistry from "./ProviderRegistry";
import { ProviderRegistryContext } from "./contexts/ProviderRegistryContext";
import TwitchChatService from "./chatServices/twitchChatService/TwitchChatService";
import useLifecycle from "./hooks/useLifecycle";
import WebSpeechOutputServiceProvider from "./outputServices/webSpeechOutputServiceProvider/webSpeechOutputServiceProvider";
import BlockingErrorMessage from "./components/BlockingErrorMessage";

enum AppState {
    Loading,
    Error,
    Loaded,
}

const App = () => {
    let [providerRegistry] = useState(new ProviderRegistry());
    let [data] = useState(new DataManager(providerRegistry));
    let [appState, setAppState] = useState<AppState>(AppState.Loading);
    let [appError, setAppError] = useState<string>("");

    useLifecycle(() => {
        const setup = async () => {
            providerRegistry.registerChatService("Twitch", TwitchChatService);
            providerRegistry.registerOutputServiceProvider(
                "Web Speech",
                WebSpeechOutputServiceProvider,
            );
            await data.initialize();

            try {
                data.loadData();
            } catch (e) {
                setAppState(AppState.Error);
                console.error(e);
                setAppError("Saved data could not be loaded.\n\n" + e);
                while (appState === AppState.Error) {
                    //just kind of sit here doing nothing.
                }
            }
            data.actionQueue.run();
            setAppState(AppState.Loaded);
        };
        setup();
    });

    const handleErrorClose = () => {
        setAppState(AppState.Loading);
    };

    if (appState === AppState.Loading) {
        return <p>Loading</p>;
    } else if (appState === AppState.Error) {
        return (
            <BlockingErrorMessage
                header="error"
                message={appError}
                onClose={handleErrorClose}
            />
        );
    } else {
        return (
            <DataContext.Provider value={data}>
                <ProviderRegistryContext.Provider value={providerRegistry}>
                    <AppContainer />
                </ProviderRegistryContext.Provider>
            </DataContext.Provider>
        );
    }
};

export default App;
