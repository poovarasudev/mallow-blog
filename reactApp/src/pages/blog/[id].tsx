import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Heart, MessageCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { toast } from "sonner";

// This would typically come from an API
const blogs = [
  {
    id: 1,
    title: "The Future of Web Development",
    description: "Exploring the latest trends and technologies shaping the future of web development.",
    content: `
      The landscape of web development is constantly evolving, bringing new challenges and opportunities for developers. In this comprehensive guide, we'll explore the latest trends and technologies that are shaping the future of web development.

      ## The Rise of Web Components
      Web Components are becoming increasingly popular as they allow developers to create reusable, encapsulated components that work across different frameworks. This technology is revolutionizing how we build and maintain web applications.

      ## AI-Powered Development
      Artificial Intelligence is making its way into web development, from code completion to automated testing. We're seeing tools that can generate entire components based on simple descriptions, making development faster and more efficient.

      ## The Future of State Management
      As applications grow more complex, state management continues to evolve. New patterns and libraries are emerging that make it easier to manage application state while maintaining performance and developer experience.

      ## Performance Optimization
      With Core Web Vitals becoming increasingly important for SEO and user experience, developers are focusing more on performance optimization. This includes techniques like:
      - Code splitting
      - Tree shaking
      - Image optimization
      - Resource prioritization

      ## Conclusion
      The future of web development is exciting, with new technologies and methodologies emerging regularly. Staying updated with these trends is crucial for any modern web developer.
    `,
    author: "Sarah Johnson",
    date: "March 15, 2024",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60",
    likes: 234,
    comments: 45,
    shares: 12,
    category: "Technology",
    readTime: "8 min read",
  },
];

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

export default function BlogPost() {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  
  const blog = blogs.find((b) => b.id === Number(id));
  
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link to="/dashboard">
            <Button className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    if (!isLiked) {
      toast.success("Added to your liked posts!");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
            <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Blog Post
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <motion.article 
            className="max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div 
              variants={item}
              className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden mb-8 group"
            >
              <motion.img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <motion.div 
                  variants={item}
                  className="flex flex-wrap items-center gap-2 mb-4"
                >
                  <span className="text-sm px-4 py-1 bg-primary/10 text-primary rounded-full backdrop-blur-sm">
                    {blog.category}
                  </span>
                  <span className="text-sm text-white/80">
                    {blog.date}
                  </span>
                  <span className="text-sm text-white/80">
                    · {blog.readTime}
                  </span>
                </motion.div>
                <motion.h1 
                  variants={item}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6"
                >
                  {blog.title}
                </motion.h1>
                <motion.div 
                  variants={item}
                  className="flex items-center space-x-4"
                >
                  <motion.img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author}`}
                    alt={blog.author}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white"
                    whileHover={{ scale: 1.1 }}
                  />
                  <div>
                    <div className="text-white font-medium">{blog.author}</div>
                    <div className="text-sm text-white/80">Author</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm"
            >
              {blog.content.split('\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-base sm:text-lg"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            <motion.div 
              variants={item}
              className="flex items-center justify-between mt-8 pt-8 border-t"
            >
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="space-x-1 rounded-full"
                    onClick={handleLike}
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    <span>{blog.likes + likes}</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="space-x-1 rounded-full"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{blog.comments}</span>
                  </Button>
                </motion.div>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="space-x-1 rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.article>
        </ScrollArea>
      </main>
    </div>
  );
}