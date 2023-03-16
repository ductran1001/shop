export const Error = (message: string) => {
    return (
        <div className="flex items-center justify-center text-red-500 h-[50vh]">An error has occurred: {message}</div>
    );
};
