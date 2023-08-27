import { ReactNode } from "react";

const ErrorMessage = ({
    header,
    message,
    children,
}: {
    header: string;
    message: string;
    children: ReactNode;
}) => {
    return (
        <>
            <h1>{header}</h1>
            <p>{message}</p>
            {children}
        </>
    );
};

export default ErrorMessage;
