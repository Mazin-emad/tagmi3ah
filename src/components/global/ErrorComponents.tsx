import { Button } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

export const ErrorPage = ({ message }: { message: string }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">An error occurred</h1>
      <p className="text-lg text-red-500">{message}</p>
      <Button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Go to Home
      </Button>
    </div>
  );
};

export const ErrorComponent = ({
  message,
  callback,
  callbackText,
}: {
  message: string;
  callback: () => void;
  callbackText: string;
}) => {
  return (
    <div className="text-center">
      <p className="text-lg text-red-500">{message}</p>
      <Button
        onClick={callback}
        className="bg-primary text-white p-2 rounded-md"
      >
        {callbackText}
      </Button>
    </div>
  );
};
