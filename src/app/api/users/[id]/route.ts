import { connectToDatabase } from '@/lib/db/mongoose';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

// This must be async to properly await `params`
export async function GET(
 req: NextRequest, { params }: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

 

   const { id } = await params;  // await here!

  try {
    const user = await User.findById(id).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
  }
}
