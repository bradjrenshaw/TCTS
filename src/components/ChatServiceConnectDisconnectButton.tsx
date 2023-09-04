import { useContext, useState } from "react";
import TabManagerContext from "../contexts/TabManagerContext";
import ChatService from "../chatServices/chatService/ChatService";

const ChatServiceConnectDisconnectButton = ({
    service,
}: {
    service: ChatService|null
}) => {
    let tabManager = useContext(TabManagerContext);
    let [connected, setConnected] = useState(
        service ? service.isConnected() : false,
    );
    let [transition, setTransition] = useState(false);

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!service) return;
        setTransition(true);
        if (connected) {
            await service.disconnect();
        } else {
            await service.connect();
            tabManager.push(service.profile);
        }
        setConnected(service.isConnected());
        setTransition(false);
    };

    return (
        <button onClick={handleClick} disabled={!service || transition}>
            {connected ? "Disconnect" : "Connect"}
        </button>
    );
};

export default ChatServiceConnectDisconnectButton;
