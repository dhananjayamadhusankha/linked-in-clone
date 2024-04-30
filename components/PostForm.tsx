"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import createPostAction from "@/actions/createPostAction";

function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;

  const [preview, setPreview] = useState<string | null>(null);

  const haddleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePostAction = async (formData: FormData) => {
    const formDataCopy = formData;
    ref.current?.reset()

    const text = formDataCopy.get("postInput") as string

    if (!text.trim()) {
      throw new Error("You must provide a post input")
    }

    setPreview(null)

    try {
      await createPostAction(formDataCopy)
    } catch (error) {
      console.log("Error creating post: ", error)
    }
  };

  return (
    <div className="mb-2">
      <form
        ref={ref}
        action={(formData) => {
          // Handle form submission with server action
          handlePostAction(formData);
          // Toaast Notification based on the promise above
        }}
        className="bg-white p-3 rounded-lg border"
      >
        <div className="flex flex-row space-x-2 items-center">
          <Avatar>
            {user?.id ? (
              <AvatarImage src={imageUrl} />
            ) : (
              <AvatarImage src="https://github.com/shadcn.png" />
            )}
            <AvatarFallback>
              {firstName?.charAt(0)} {lastName ? lastName.charAt(0) : null}
            </AvatarFallback>
          </Avatar>

          <input
            type="text"
            name="postInput"
            placeholder="Start writing a post..."
            className="bg-white border rounded-full py-3 flex-1 px-4 outline-none"
          />

          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            hidden
            onChange={haddleImageChange}
          />
          <button type="submit" hidden>
            Post
          </button>
        </div>

        {/* Preview additional check */}
        {preview && (
          <div className="mt-3">
            <img src={preview} alt="Preview" className="w-full object-cover" />
          </div>
        )}

        <div className="flex flex-row mt-2 space-x-2 justify-end">
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className="mr-2" size={16} />
            {preview ? "Change" : "Add"} image
          </Button>

          {/* Add a remove priview button */}
          {preview && (
            <Button
              variant="outline"
              type="button"
              onClick={() => setPreview(null)}
            >
              <XIcon className="mr-2" size={16} />
              Remove Image
            </Button>
          )}
        </div>
      </form>
      <hr className="mt-2 border-gray-300" />
    </div>
  );
}

export default PostForm;
