import { NextResponse, type NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import PostModel from '@/models/Post.model';
import mongoose from 'mongoose';

// GET post by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  await connectToDatabase();

  const { postId } = await params;  // await here!

  const post = await PostModel.findById(postId)
  .populate({
    path: 'comments.author',
    select: 'name image email', // Only return what you need
  })
  .populate({
    path: 'author', // If your post has an author too
    select: 'name image email',
  });


  if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post, { status: 200 });
}
// DELETE post by ID




export async function DELETE(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {

    await connectToDatabase();

  const { postId } = await params;  // await here!
   const post= await PostModel.findByIdAndDelete(postId);


    if (post) {
        return NextResponse.json({ message: 'Post deleted successfully' });
  }
    if (!post) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post, { status: 200 });
}

// PATCH update post by ID

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const { postId } = await params;


    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }

    if (body.action === 'like') {
      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { $inc: { likes: 1 } },
        { new: true }
      );
      if (!updatedPost) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({
  message: 'Post updated',
  likes: updatedPost.likes,  // ✅ Include this
});

    }

    if (body.action === 'comment') {
      const { author, content } = body;
      if (!content) {
        return NextResponse.json({ message: 'Comment content is required' }, { status: 400 });
      }

      const updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { $push: { comments: { author, content } } },
        { new: true }
      );

      if (!updatedPost) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Comment added', comments: updatedPost.comments });
    }

    // ... handle normal update
    const { title, content, tags, image } = body;

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { title, content, tags, image },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 });
  }
}


