import connectDB from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ message: "No post found" }, { status: 404 });
    }

    const likes = post.likes;
    return NextResponse.json(likes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `An error occurred while fetching unlikes : ${error}` },
      { status: 500 }
    );
  }
}

export interface UnlikePostRequestBody {
  userId: string;
}

export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  auth().protect();
  await connectDB();

  const { userId }: UnlikePostRequestBody = await request.json();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json("Not found post", { status: 404 });
    }

    await post.unlikePost(userId)
    return NextResponse.json("Post sucessfully unliked", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `An error occurred while unliking the post: ${error}` },
      { status: 500 }
    );
  }
}
