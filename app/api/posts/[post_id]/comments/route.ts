import connectDB from "@/mongodb/db";
import { ICommentBase } from "@/mongodb/models/comments";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      console.log("Post not found")
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await post.getAllComments();
    NextResponse.json(
      { message: "Fetching all comments successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `An error occurred while fetching all comments: ${error}` },
      { status: 500 }
    );
  }
}

export interface AddCommentRequestBody {
  user: IUser;
  text: string;
}

export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();

  const { user, text }: AddCommentRequestBody = await request.json();
  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      console.log("Post not found")
      return NextResponse.json("Post not found", { status: 404 });
    }

    const comment: ICommentBase = {
      user,
      text,
    };

    await post.commentOnPost(comment);
    return NextResponse.json(
      { message: "Comment added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `An error occurred while saving the comment: ${error}` },
      { status: 500 }
    );
  }
}
