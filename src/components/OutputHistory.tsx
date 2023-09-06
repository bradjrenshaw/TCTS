import { useEffect, useState } from "react";
import Profile from "../Profile";
import UniqueItemListEvent from "../events/UniqueItemListEvent";
import useLifecycle from "../hooks/useLifecycle";

const OutputHistory = ({ profile }: { profile: Profile }) => {
    let [messages, setMessages] = useState<Array<string>>([
        ...profile.outputHistory,
    ]);

    const handleOutputHistoryAdd = (event: UniqueItemListEvent<string>) => {
        setMessages([...profile.outputHistory]);
    };

    useLifecycle(
        () => {
            profile.outputHistory.addEventListener(
                "push",
                handleOutputHistoryAdd as EventListener,
            );
        },
        () => {
            profile.outputHistory.removeEventListener(
                "add",
                handleOutputHistoryAdd as EventListener,
            );
        },
    );

    return (
        <>
            {messages.map((message: string, index) => (
                <p key={index}>{message}</p>
            ))}
        </>
    );
};

export default OutputHistory;
