"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ImageIcon } from "lucide-react";
import { useRef, useState } from "react";

function PostForm() {
  const ref = useRef<HTMLFormElement>(null); 
  const fileInputRef = useRef<HTMLFormElement>(null); 
  const { user } = useUser();
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;

  const [priview, setPriview] = useState(false)

  const haddleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if(file){
      setPriview(true);
    }
  }

  return (
    <div className="bg-white p-5 rounded-lg">
      <form action="">
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
        </div>

        <input type="file" name="image" accept="image/*" hidden onChange={haddleImageChange}/>
        <button type="submit" hidden>Post</button>

        {/* Preview additional check */}

        <div>
          <Button variant={"secondary"}>
            <ImageIcon className="mr-2" size={16} color="correntColor"/>
            Add
          </Button>

          {/* Add a remove priview button */}
          <Button variant={"secondary"}>
            <ImageIcon className="mr-2" size={16} color="correntColor"/>
            Add
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
