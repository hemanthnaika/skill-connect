import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="bg-secondary w-screen h-screen flex items-center justify-center">
      <LoaderCircle className="text-primary w-20 h-20 animate-spin" />
    </div>
  );
};

export default Loading;
