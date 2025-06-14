import Image from "next/image";


type Post = {
    _id: string;
    title: string;
    content: string;
    image?: string;
    tags?: string[];
    likes?: number;
};

type BlogCardProps = {
    post: Post;
};

const BlogCard = ({ post }: BlogCardProps) => {
    return (
        <div
            key={post._id}
            className="border rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition-shadow duration-300 w-[320px] h-[420px] flex flex-col"
        >
            {post.image && (
                <div className="relative w-full h-[180px]">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-2 max-w-[200px]">
                        {post.tags?.map((tag: string) => (
                            <span
                                key={tag}
                                className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                  
                </div>
            </div>
        </div>
    )
}

export default BlogCard;
