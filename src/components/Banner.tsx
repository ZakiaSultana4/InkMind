type BannerProps = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
};

const Banner = ({ searchInput, setSearchInput, handleSearch }: BannerProps) => {
  return (
    <div className="relative w-[98%] mx-auto rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-6 text-center shadow-lg mb-10 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-sm">
          Welcome to <span className="text-yellow-300">Your AI Blog Assistant</span>
        </h1>
        <p className="text-lg md:text-xl font-medium mb-8">
          Create, summarize, and tag your blog posts with AI-powered tools
        </p>

        <div className="flex justify-center max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search blog posts or topics..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-5 py-3 rounded-l-md text-gray-900 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-400 text-gray-900 font-semibold px-6 rounded-r-md hover:bg-yellow-300 transition"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
