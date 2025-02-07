import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import CreatePostModal from "@/components/create-post-modal";
import { fetchPostsRequest, likePostRequest, resetPosts } from "@/store/slices/postsSlice";
import { RootState } from "@/store";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function Dashboard() {
    const dispatch = useDispatch();
    const { posts, loading, hasMore } = useSelector((state: RootState) => state.posts);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const observerRef = useRef<IntersectionObserver>();
    const lastPostRef = useRef<HTMLDivElement>(null);

    const loadMorePosts = useCallback(() => {
        if (!loading && hasMore) {
            dispatch(fetchPostsRequest());
        }
    }, [dispatch, loading, hasMore]);

    useEffect(() => {
        dispatch(resetPosts());
        dispatch(fetchPostsRequest());

        return () => {
            dispatch(resetPosts());
        };
    }, [dispatch]);

    useEffect(() => {
        if (loading) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMorePosts();
                }
            },
            { threshold: 0.5 }
        );

        if (lastPostRef.current) {
            observerRef.current.observe(lastPostRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loading, hasMore, loadMorePosts]);

    const toggleLike = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(likePostRequest(id));
        setLikedPosts((prev) =>
            prev.includes(id) ? prev.filter((postId) => postId !== id) : [...prev, id]
        );
        if (!likedPosts.includes(id)) {
            toast.success("Added to your liked posts!");
        }
    };

    const handleShare = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(`${window.location.origin}/blog/${id}`);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <CreatePostModal />
                    </div>
                </div>
            </header>

            <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <ScrollArea className="h-[calc(100vh-5rem)]">
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                ref={index === posts.length - 1 ? lastPostRef : null}
                                variants={item}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <Link to={`/blog/${post.id}`}>
                                    <div className="rounded-3xl bg-white dark:bg-gray-800 p-1 shadow-sm hover:shadow-xl transition-all duration-300">
                                        <div className="relative rounded-[22px] overflow-hidden">
                                            <motion.img
                                                src={post.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60"}
                                                alt={post.title}
                                                className="w-full h-48 object-cover"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <div className="p-4 sm:p-6">
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                          {post.category || "Blog"}
                        </span>
                                                <span className="text-xs text-muted-foreground">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                                            </div>
                                            <h2 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t">
                                                <div className="flex items-center gap-2">
                                                    <motion.img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.name}`}
                                                        alt={post.author.name}
                                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                                                        whileHover={{ scale: 1.1 }}
                                                    />
                                                    <span className="text-sm font-medium hidden sm:block">
                            {post.author.name}
                          </span>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:scale-110 transition-transform"
                                                        onClick={(e) => toggleLike(e, post.id)}
                                                    >
                                                        <Heart
                                                            className={`h-4 w-4 transition-colors ${
                                                                post.is_liked ? "fill-red-500 text-red-500" : ""
                                                            }`}
                                                        />
                                                        <span className="ml-1 hidden sm:inline">{post.likes_count}</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:scale-110 transition-transform hidden sm:flex"
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <MessageCircle className="h-4 w-4" />
                                                        <span className="ml-1">{post.comments_count}</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:scale-110 transition-transform"
                                                        onClick={(e) => handleShare(e, post.id)}
                                                    >
                                                        <Share2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    {loading && (
                        <div className="mt-8 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {!loading && !hasMore && posts.length > 0 && (
                        <p className="text-center text-muted-foreground mt-8">
                            No more posts to load
                        </p>
                    )}

                    {!loading && posts.length === 0 && (
                        <div className="text-center mt-8">
                            <p className="text-xl font-semibold">No posts found</p>
                            <p className="text-muted-foreground">Be the first to create a post!</p>
                        </div>
                    )}
                </ScrollArea>
            </main>
        </div>
    );
}
