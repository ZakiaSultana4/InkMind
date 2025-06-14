import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
interface Post {
    _id: string;
    title: string;
    content: string;
    image?: string;
    tags: string[];
}
type UpdatePostResponse = {
    message: string;
    likes?: number;
    comments?: {
        _id: string;
        content: string;
        author?: string;
        createdAt?: string;
    }[];
};
// At the top, add User type
interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
}

export const postApi = createApi({
    reducerPath: 'postApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Post'],
    endpoints: (builder) => ({

        getAllPosts: builder.query<{
            data: Post[];
            currentPage: number;
            totalPages: number;
            totalPosts: number;
        }, { search?: string; page?: number; limit?: number }>({
            query: ({ search = '', page = 1, limit = 6 }) =>
                `posts?search=${search}&page=${page}&limit=${limit}`,
            providesTags: ['Post'],
        }),

        createPost: builder.mutation({
            query: (newPost) => ({
                url: 'posts',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: ['Post'],
        }),
        getPostById: builder.query({
            query: (postId) => `/posts/${postId}`,
            providesTags: (result, error, postId) => [{ type: 'Post', postId }],

        }),
        getUserPosts: builder.query({
            query: (authorId) => `posts/user/${authorId}`,
            providesTags: ['Post'],
        }),

        updatePost: builder.mutation<UpdatePostResponse, {
            postId: string;
            data: {
                action?: 'like' | 'comment';
                content?: string;
                author?: string;
                title?: string;
                tags?: string[];
                image?: string;
            };
        }>({
            query: ({ postId, data }) => ({
                url: `/posts/${postId}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
        }),


        deletePost: builder.mutation({
            query: (postId) => ({
                url: `/posts/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Post'],
        }),
        getUserById: builder.query<User, string>({
  query: (id) => `users/${id}`,
}),
    }),
})

export const {
    useGetAllPostsQuery,
    useGetPostByIdQuery,
    useCreatePostMutation,
    useGetUserPostsQuery,
    useUpdatePostMutation,
    useDeletePostMutation,
     useGetUserByIdQuery, // ✅ NEW HOOK
} = postApi
