import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  video_url: string;
  thumbnail_url: string;
  author_name: string;
  author_avatar: string;
  is_active: boolean;
  views: number;
  likes: number;
  created_at: string;
}

const AdminBlogPosts = ({ onStatsUpdate }: { onStatsUpdate?: () => void }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "general",
    video_url: "",
    thumbnail_url: "",
    author_name: "",
    author_avatar: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(formData)
          .eq("id", editingPost.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        const { error } = await supabase.from("blog_posts").insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadPosts();
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ is_active: !post.is_active })
        .eq("id", post.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Blog post ${post.is_active ? "hidden" : "activated"}`,
      });

      loadPosts();
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error("Error toggling blog post:", error);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });

      loadPosts();
      if (onStatsUpdate) onStatsUpdate();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "general",
      video_url: "",
      thumbnail_url: "",
      author_name: "",
      author_avatar: "",
    });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      description: post.description || "",
      content: post.content || "",
      category: post.category,
      video_url: post.video_url || "",
      thumbnail_url: post.thumbnail_url || "",
      author_name: post.author_name,
      author_avatar: post.author_avatar || "",
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blog Posts</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Edit Blog Post" : "Add New Blog Post"}
              </DialogTitle>
              <DialogDescription>
                Create or edit blog posts and Instagram videos
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="e.g. financial, education, travel"
                />
              </div>
              <div>
                <Label htmlFor="video_url">Video URL (Instagram/YouTube)</Label>
                <Input
                  id="video_url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="author_name">Author Name</Label>
                <Input
                  id="author_name"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="author_avatar">Author Avatar URL</Label>
                <Input
                  id="author_avatar"
                  name="author_avatar"
                  value={formData.author_avatar}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
              <Button type="submit" className="w-full">
                {editingPost ? "Update Post" : "Create Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No blog posts yet. Create your first one!
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{post.title}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>By {post.author_name}</span>
                    <span>👁 {post.views} views</span>
                    <span>❤ {post.likes} likes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(post)}
                  >
                    {post.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBlogPosts;
