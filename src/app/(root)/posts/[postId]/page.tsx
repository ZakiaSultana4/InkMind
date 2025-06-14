'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGetPostByIdQuery, useUpdatePostMutation } from '@/redux/features/post/postApi';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Author {
  _id: string;
  name?: string | null;
  image?: string | null;
}

interface Comment {
  _id: string;
  author?: Author;
  content: string;
  createdAt: string; // or Date if parsed
}


const PostDetails = () => {
  const { postId } = useParams();
  const {
    data: post,
    isLoading,
    error,
    refetch, // 👈 here
  } = useGetPostByIdQuery(postId);

  const [updatePost] = useUpdatePostMutation();

  const { data: session } = useSession();
  console.log(post);

  // Likes State
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes ?? 0);

  // Comments state
  const [comments, setComments] = useState<Comment[]>(post?.comments ?? []);

  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');


  // Initialize likes and comments when post data changes
  useEffect(() => {
    if (post) {
      setLikesCount(post.likes ?? 0);
      setLiked(false); // Optional: you may want to check if user already liked post
      setComments(post.comments ?? []);
    }
  }, [post]);

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error || !post) return <p className="text-center py-10 text-red-500">Post not found.</p>;

  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Like/unlike handler
  const toggleLike = async () => {
    try {
      const newLiked = !liked;
      setLiked(newLiked);

      const res = await updatePost({
        postId: Array.isArray(postId) ? postId[0] ?? '' : postId ?? '',
        data: { action: 'like' },
      }).unwrap();

      setLikesCount(res.likes ?? 0);

      await refetch(); // 🔁 force update from server
    } catch {
      setLiked((prev) => !prev);
      alert('Failed to update like');
    }
  };




  const commentsCount = comments.length;


  // Submit a new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await updatePost({
        postId: Array.isArray(postId) ? postId[0] ?? '' : postId ?? '',
        data: {
          action: 'comment',
          content: commentInput,
          author: session?.user?.id // or pass name/email depending on schema
        }
      }).unwrap();

      // If backend returns updated comments
      setComments(
        (res.comments ?? []).map((comment: { _id: string; content: string; author?: string | Author; createdAt?: string }) => ({
          ...comment,
          author:
            typeof comment.author === 'string' || typeof comment.author === 'undefined'
              ? undefined
              : comment.author,
          createdAt: comment.createdAt ?? new Date().toISOString(),
        }))
      );
        await refetch(); // 🔁 force update from server
      setCommentInput('');
    } catch {
      setSubmitError('Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">{post.title}</h1>

      {/* Blog Image */}
      {post.image && (
        <div className="w-full h-[300px] relative mb-6 rounded-xl overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
            quality={90}
            priority
          />
        </div>
      )}

      {/* Author Info and Date */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/user/${post.author._id}`}>
        {post.author?.image ? (
          <Image
            src={post.author.image}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div
          className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold text-lg select-none"
          title={post.author?.name}
          >
            {post.author?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        </Link>
        <div>
          <p className="text-gray-800 font-medium">{post.author?.name || 'Unknown Author'}</p>
          <p className="text-gray-500 text-sm">{formattedDate}</p>
        </div>
      </div>

      {/* Content */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
        {post.content}
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {post.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>
      {/* Like & Comment Info */}
      <div className="flex items-center gap-6 mb-6">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold transition-colors
            ${likesCount ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 hover:bg-gray-500'}`}
          aria-pressed={likesCount}
        >
          <svg
            className="w-5 h-5"
            fill={likesCount ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.42 3.42 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5 18.58 5 20 6.42 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {likesCount}
        </button>

        <div className="flex items-center gap-2 text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
          </svg>
          {commentsCount}
        </div>
      </div>



      {/* Comments Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Comments ({commentsCount})</h2>

        {/* Comment list */}
        {comments.length === 0 && <p className="text-gray-500 mb-4">No comments yet.</p>}
        <ul className="mb-6 space-y-4 max-h-64 overflow-y-auto">
          {comments.map((comment: Comment) => (
            <li key={comment._id} className="border rounded p-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Link href={`/user/${comment.author?._id}`}>
                  {comment.author?.image ? (
                    <Image src={comment.author.image} alt="User" width={32} height={32} className="rounded-full" />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold text-lg"
                      title={comment.author?.name ?? 'Unknown User'}
                    >
                      {comment.author?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                  )}
                </Link>
                <span className="text-sm font-medium text-gray-700">
                  {comment.author?.name || "Unknown User"}
                </span>
                <span className="ml-auto text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </li>
          ))}
        </ul>

        {/* Comment form */}
        <form onSubmit={handleSubmitComment} className="flex flex-col gap-2">
          <textarea
            className="border rounded p-2 resize-none"
            rows={3}
            placeholder="Write a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            disabled={isSubmitting}
            required
          />
          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="self-end bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostDetails;
