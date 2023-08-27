import ErrorMessage from "./Error";

type OnCloseCallbackType = () => void;

const BlockingErrorMessage = ({header, message, onClose}: {header: string, message: string, onClose: OnCloseCallbackType}) => {
    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClose();
    };

    return <ErrorMessage header={header} message={message}>
        <button onClick={handleClose}>Close</button>
    </ErrorMessage>
};

export default BlockingErrorMessage;