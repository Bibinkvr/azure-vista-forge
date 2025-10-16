import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, Eye } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  category: string;
  video_url: string;
  thumbnail_url: string;
  author_name: string;
  author_avatar: string;
  views: number;
  likes: number;
  created_at: string;
}

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Latest Updates
            </h2>
            <p className="text-muted-foreground text-lg">
              Stay updated with our latest stories and insights
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              onClick={scrollPrev}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={scrollNext}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_45%] lg:flex-[0_0_30%]"
              >
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-elegant transition-smooth">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.thumbnail_url || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-smooth"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <span>{post.category}</span>
                      <span>|</span>
                      <span>
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 line-clamp-2">
                      {post.title}
                    </h3>

                    {post.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {post.description}
                      </p>
                    )}

                    {/* Author & Stats */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {post.author_avatar ? (
                          <img
                            src={post.author_avatar}
                            alt={post.author_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                            <span className="text-primary-foreground text-xs font-bold">
                              {post.author_name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium">
                          by {post.author_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                      </div>
                    </div>

                    {post.video_url && (
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => window.open(post.video_url, "_blank")}
                      >
                        Watch Video
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
