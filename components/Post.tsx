"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Post({ post }: { post: IPostDocument }) {
  const { user } = useUser();
  const firstName = user?.firstName;
  const lastName = user?.lastName;
  const imageUrl = user?.imageUrl;

  const isAuthor = user?.id === post.user.userId;
  return (
    <div>
      <div>
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
      </div>
    </div>
  );
}

export default Post;
