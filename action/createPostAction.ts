"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let imageUrl: string | undefined;

  if (!postInput) {
    throw new Error("Post input is required");
  }

  // define user
  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  // upload image if there is one
  if (image.size > 0) {
    // 1. upload image if there is one
    const body: AddPostRequestBody = {
      user: userDB,
      text: postInput,
      imageUrl: imageUrl
    };
    // 2. create post in database with image
    await Post.create(body);

  } else {
    // 1. create post in database without image
    const body: AddPostRequestBody = {
      user: userDB,
      text: postInput,
    };
    await Post.create(body);
  }
  // revalidatePath '/' - home page
}
