'use client';

import { useState } from 'react';
import { useGetAllPostsQuery } from '@/redux/features/post/postApi';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from './BlogCard';
import { Post } from '@/types';



const AllBlogs = ({ searchQuery }: { searchQuery: string }) => {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, error } = useGetAllPostsQuery({ search: searchQuery, page, limit });

  const posts = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="px-4 py-6">
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">Error loading posts</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
        {posts?.length ? (
          posts.map((post: Post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group border border-gray-100"
            >
              <Link href={`/posts/${post._id}`}>

                <BlogCard key={post._id} post={post} />

              </Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">No posts found.</p>
        )}
      </div>

      {/* Pagination Controls */}


      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-2">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition 
        ${page === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md'}`}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-full text-sm font-semibold transition duration-200 ease-in-out
          ${page === p
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              {p}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition 
        ${page === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 shadow-md'}`}
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}

    </div>
  );
};

export default AllBlogs;
