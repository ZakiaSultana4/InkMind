import { connectToDatabase } from '@/lib/db/mongoose'
import PostModel from '@/models/Post.model'
import User from '@/models/user.model'
import { NextResponse } from 'next/server'

// GET /api/posts - Fetch all posts
// GET /api/posts?page=1&limit=10&search=react
export const GET = async (req: Request) => {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    const totalPosts = await PostModel.countDocuments(query); // Total for pagination
    const posts = await PostModel.find(query)
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit);

    return new Response(
      JSON.stringify({
        data: posts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response('Failed to fetch posts', { status: 500 });
  }
};


// This route handles creating a new post with an image
// It expects the request body to include title, content, tags, image URL, and authorEmail
// POST /api/posts
export const POST = async (req: Request) => {
  try {
    await connectToDatabase()
    const body = await req.json()

    const { title, content, tags, image, authorEmail } = body
    console.log('Received post data:', { title, content, tags, image, authorEmail })

    const author = await User.findOne({ email: authorEmail })
    if (!author) {
      return NextResponse.json({ message: 'Author not found' }, { status: 404 })
    }

    const newPost = await PostModel.create({
      title,
      content,
      tags,
      image,
      author: author._id,
    })

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 })
  }
}

