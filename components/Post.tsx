"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ReactTimeago from "react-timeago";
import deletePostAction from "@/actions/deletePostAction";
import PostOption from "./PostOption";

function Post({ post }: { post: IPostDocument }) {
  const { user } = useUser();
  const firstName = post.user.firstName;
  const lastName = post.user.lastName;
  const imageUrl = post.user.userImage;

  const isAuthor = user?.id === post.user.userId;
  return (
    <div className="bg-white border rounded-lg">
      <div className="p-4 flex space-x-2 ">
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
        <div className="flex justify-between flex-1">
          <div className="flex flex-col">
            <p className="font-semibold">
              {firstName} {lastName}{" "}
              {isAuthor && <Badge variant={"secondary"}>Author</Badge>}
            </p>
            <p className="text-xs text-gray-400">
              @{firstName}-{lastName}-{post.user.userId.toString().slice(-4)}
            </p>

            <p className="text-xs text-gray-400">
              <ReactTimeago date={new Date(post.createdAt)} />
            </p>
          </div>
          {isAuthor && (
            <Button
              variant={"outline"}
              onClick={() => {
                const promise = deletePostAction(post._id);

                // Toast
              }}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
      <div>
        <p className="px-4 mt-2 pb-2">{post.text}</p>
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt="Post image"
            width={500}
            height={500}
            className="mx-auto w-full"
          />
        )}
      </div>
      <PostOption post={post}/>
    </div>
  );
}

export default Post;