import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  try {
    await connectDB();
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ message: "No post found" }, { status: 404 });
    }
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `An error occurred while fetching the post: ${error}` },
      { status: 500 }
    );
  }
}

export interface DeletePostRequestBody {
  userId: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  auth().protect();
  await connectDB();

  const { userId }: DeletePostRequestBody = await request.json();
  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ message: "No post found" }, { status: 404 });
    }

    if (post.user.userId !== userId) {
      throw new Error("Post does not belong to the user");
    }

    await post.removePost();
    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `An error occurred while deleting the post: ${error}` },
      { status: 500 }
    );
  }
}
