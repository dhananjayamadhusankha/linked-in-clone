"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSASToken, { containerName } from "@/lib/generateSASTaken";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { BlobServiceClient } from "@azure/storage-blob";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let image_url = undefined;

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

  try {
    if (image.size > 0) {
      // 1. upload image if there is one - MS Blob storage
      console.log("Uploading image to Azure Blob Storage...", image);

      const accountName = process.env.AZURE_STORAGE_NAME;
      const sasToken = await generateSASToken();

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      const timestamp = new Date().getTime();
      const filename = `${randomUUID()}_${timestamp}.png`;

      const blockBlobClient = containerClient.getBlockBlobClient(filename);

      const imageBuffer = await image.arrayBuffer();
      const res = await blockBlobClient.uploadData(imageBuffer);
      image_url = res._response.request.url;

      console.log("File uploaded successfully!", image_url);
      // 2. create post in database with image
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: image_url,
      };
      await Post.create(body);
    } else {
      // 1. create post in database without image
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };
      await Post.create(body);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Fail to create post");
  }

  // revalidatePath '/' - home page
}
