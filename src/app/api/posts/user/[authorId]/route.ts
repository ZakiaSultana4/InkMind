import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import PostModel from '@/models/Post.model';

// correct async function signature
export async function GET(
req: NextRequest, { params }: { params: Promise<{ authorId: string }> }
) {
  try {
    // ✅ await context.params in App Router
    const { authorId } = await params;


    await connectToDatabase();

    if (!authorId) {
      return NextResponse.json({ message: 'Author ID is required' }, { status: 400 });
    }

    const posts = await PostModel.find({ author: authorId }).sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ message: 'Failed to fetch user posts' }, { status: 500 });
  }
}
