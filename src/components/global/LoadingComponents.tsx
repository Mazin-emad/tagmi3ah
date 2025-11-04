export const LoadingPage = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export const LoadingComponent = () => {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  );
};
