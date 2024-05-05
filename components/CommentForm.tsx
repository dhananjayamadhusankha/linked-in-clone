"use client";

import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import createCommentAction from "@/actions/createCommentAction";
import { toast } from "sonner";

function CommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);

  const createCommentActionWithPostId = createCommentAction.bind(null, postId);

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    const formDataCopy = formData;
    ref.current?.reset();

    try {
      await createCommentActionWithPostId(formDataCopy);
    } catch (error) {
      console.error(`Error creating comment: ${error}`);
    }
  };

  return (
    <form
      ref={ref}
      action={(formData) => {
        const promise = handleCommentAction(formData);
        toast.promise(promise, {
          loading: "Creating comment...",
          success: "Comment created",
          error: "Failed to create comment",
        });
      }}
      className="flex items-center space-x-2"
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>
          {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex w-full bg-white flex-1 pb-2">
        <input
          className="border rounded-full h-10 p-4 flex-1 outline-none bg-transparent text-sm"
          placeholder="Add a comment..."
          name="commentInput"
        />
        <button type="submit" className="" hidden>
          Comment
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
