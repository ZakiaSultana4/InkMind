'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDeletePostMutation, useGetUserPostsQuery } from '@/redux/features/post/postApi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';
import BlogCard from '@/components/BlogCard';

interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  tags: string[];
}

const UserPosts = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const { data: posts, error, isLoading } = useGetUserPostsQuery(session?.user?.id, {
    skip: !session?.user?.id,
  });

  const [deletePost] = useDeletePostMutation();

  if (isLoading) return <div>Loading your posts...</div>;
  if (error) return <div>Failed to load posts</div>;
  if (!posts || posts.length === 0) return <div>You have no posts yet.</div>;

  const openConfirm = (postId: string) => {
    setPostToDelete(postId);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setPostToDelete(null);
    setConfirmOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete).unwrap();
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Delete failed', error);
      toast.error('Failed to delete post');
    } finally {
      closeConfirm();
    }
  };

  const handleEdit = (post: Post) => {
    router.push(`/edit/${post._id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post: Post) => (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300  border-gray-100 flex flex-col"
          >
            <Link href={`/posts/${post._id}`} >
           

                <BlogCard key={post._id} post={post} />

            
            </Link>

            {/* Edit & Delete Buttons */}
            <div className="mt-auto flex justify-end gap-4 px-5 pb-5 pt-3 border-t border-gray-200">
              <button
                onClick={() => handleEdit(post)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => openConfirm(post._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        message="Are you sure you want to delete this post?"
        onConfirm={handleDeleteConfirmed}
        onCancel={closeConfirm}
      />
    </div>
  );
};

export default UserPosts;
