'use client';

import { useCreatePostMutation } from '@/redux/features/post/postApi';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import AIAssistant from '@/components/AIAssistant';

const CreatePostPage = () => {
  const { data: session } = useSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [createPost] = useCreatePostMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error('You must be logged in to create a post.');
      return;
    }

    // Upload image to Cloudinary
    let imageUrl = '';
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', 'bikeStore');

        const res = await fetch('https://api.cloudinary.com/v1_1/dmvw2gidg/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
        const data = await res.json();
        imageUrl = data.secure_url;
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Failed to upload image');
        return;
      }
    }

    const postData = {
      title,
      content,
      tags: tags.split(',').map((tag) => tag.trim()),
      image: imageUrl,
      authorEmail: session.user.email,
    };

    try {
      await createPost(postData).unwrap();
      toast.success('Post created successfully!');
      setTitle('');
      setContent('');
      setTags('');
      setImageFile(null);
    } catch {
      toast.error('Failed to create post.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-10">
      {/* Form Section */}
      <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Write a Blog Post</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 w-full border border-gray-300 rounded-md p-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter the title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              className="mt-1 w-full border border-gray-300 rounded-md p-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              rows={10}
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              className="mt-1 w-full border border-gray-300 rounded-md p-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. JavaScript, React, WebDev"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Blog Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="mt-1 w-full text-gray-700"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Publish
          </button>
        </form>
      </div>

      {/* AI Sidebar Section */}
      <div className="bg-gray-50 rounded-xl shadow-inner p-6 border border-gray-200 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Writing Assistant</h2>
        <AIAssistant
          title={title}
          content={content}
          onUpdateContent={setContent}
          onUpdateTags={(aiTags) => setTags(aiTags.join(', '))}
        />
      </div>
    </div>
  );
};

export default CreatePostPage;
