import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full bg-base-200/50">
      <div className="flex flex-col items-center gap-2 max-w-md text-center px-4">
        <div className="p-4 rounded-full bg-primary/10 mb-4">
          <MessageSquare className="w-12 h-12 text-primary" />
        </div>
        
        <h2 className="text-2xl font-semibold">
            No conversation selected
        </h2>
        
        <p className="text-base-content/70">
          Choose a conversation from the sidebar or start a new chat to begin messaging
        </p>

        <div className="mt-8 p-4 rounded-lg bg-base-300/50 w-full">
          <h3 className="font-medium mb-2">
            Quick Tips:
          </h3>
          <ul className="space-y-2 text-sm text-base-content/70">
            <li>• Your messages are end-to-end encrypted</li>
            <li>• You can share images and text messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;