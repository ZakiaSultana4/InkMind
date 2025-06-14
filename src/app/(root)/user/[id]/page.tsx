'use client';

import { useParams } from 'next/navigation';
import { useGetUserByIdQuery, useGetUserPostsQuery } from '@/redux/features/post/postApi';
import Image from 'next/image';
import BlogCard from '@/components/BlogCard';
import { Post } from '@/types';
import Link from 'next/link';
// import { FaHeart } from 'react-icons/fa';


const UserProfilePage = () => {
    const { id } = useParams();
    const userId = id as string;

    const { data: user, isLoading: userLoading } = useGetUserByIdQuery(userId);
    const { data: posts, isLoading: postsLoading } = useGetUserPostsQuery(userId);

    if (userLoading || postsLoading) return <p>Loading...</p>;

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            {/* User Info */}
            <div className="flex items-center gap-6 mb-10">
                {user?.image ? (
                    <Image
                        src={user.image}
                        alt={user.name}
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center text-white text-4xl font-semibold">
                        {user?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                )}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{user?.name ?? 'Unknown'}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    {user?.bio && <p className="mt-2 text-gray-700 max-w-xl">{user.bio}</p>}
                </div>
            </div>

            {/* User's Posts */}
            <div>
                <h3 className="text-2xl font-semibold mb-6">Posts by {user?.name}</h3>
                {posts?.length === 0 ? (
                    <p className="text-gray-500">No posts found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {posts.map((post: Post) => (
                            <Link key={post._id} href={`/posts/${post._id}`}>

                                <BlogCard post={post} />
                                {/* <div className="flex items-center text-red-500 space-x-1">
                                    <FaHeart />
                                    <span className="text-sm">{post.likes ?? 0}</span>
                                </div> */}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
