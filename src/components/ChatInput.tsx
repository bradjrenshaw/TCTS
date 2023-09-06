import { useState } from "react";
import Profile from "../Profile";

const ChatInput = ({ profile }: { profile: Profile }) => {
    let [message, setMessage] = useState<string>("");
    let [enabled, setEnabled] = useState<boolean>(true);

    const handleMessageChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setMessage(event.target.value);
    };

    const handleSendClick = (event: React.FormEvent<HTMLFormElement>) => {
        const sendMessage = async (message: string) => {
            setEnabled(false);
            let result = await profile.chatService?.sendMessage(message);
            console.log("result");
            console.log(result);
            setEnabled(true);
        };

        event.preventDefault();
        sendMessage(message);
        setMessage("");
    };

    return (
        <form onSubmit={handleSendClick}>
            <label htmlFor="inputChat">Chat: </label>
            <input type="text" value={message} onChange={handleMessageChange} />
            <input type="submit" value="Send" />
        </form>
    );
};

export default ChatInput;
