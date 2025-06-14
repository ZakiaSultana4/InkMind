'use client';

import React, { useState, useEffect } from 'react';
import { useParams} from 'next/navigation';
import { useGetPostByIdQuery, useUpdatePostMutation } from '@/redux/features/post/postApi';

const EditPostPage = () => {
  const { postId } = useParams();


  const { data: post, isLoading, error } = useGetPostByIdQuery(postId);
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  // Populate form when data arrives
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.join(', ')); // tags as comma-separated string
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updatePost({
        id: postId,
        data: {
          title,
          content,
          tags: tags.split(',').map((tag) => tag.trim()),
        },
      }).unwrap();

      alert('Post updated successfully!');
     
    } catch (err) {
      console.error('Failed to update post:', err);
      alert('Update failed.');
    }
  };

  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p>Failed to load post.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded h-40"
          required
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isUpdating ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
