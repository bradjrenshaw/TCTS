let ErrorList = ({ errors }: { errors: Array<string> }) => {
    return (
        <ul>
            {errors.map((error: string) => (
                <li key={error}>{error}</li>
            ))}
        </ul>
    );
};

export default ErrorList;
