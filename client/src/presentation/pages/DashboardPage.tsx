import React, { useState, useRef } from "react";
import { useBlogsQuery, useCreateBlogMutation } from "../../application/queries/useBlogQueries";
import { BlogCard } from "../components/BlogCard";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";

export const DashboardPage: React.FC = () => {
  const { data: blogs, isLoading, isError } = useBlogsQuery();
  const createMutation = useCreateBlogMutation();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { title: title.trim(), content: content.trim(), image: image ?? undefined },
      {
        onSuccess: () => {
          setTitle(""); setContent(""); setImage(null); setShowForm(false);
          if (fileRef.current) fileRef.current.value = "";
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-grid pb-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Your Blog Dashboard</h1>
            <p className="text-slate-500 text-sm">Create, manage, and share your stories</p>
          </div>
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "0.65rem 1.4rem" }}
            onClick={() => {
              setShowForm(!showForm);
              createMutation.reset();
            }}
          >
            {showForm ? "✕ Cancel" : "+ New Post"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="glass-card p-6 mb-10 fade-in">
            <h2 className="text-lg font-semibold text-white mb-5">New Blog Post</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                id="new-title"
                label="Title"
                placeholder="Enter your blog title…"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  createMutation.reset();
                }}
              />
              <Textarea
                id="new-content"
                label="Content"
                placeholder="Write your blog content here…"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  createMutation.reset();
                }}
              />
              <div>
                <label className="label">Cover Image (optional)</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files?.[0] ?? null);
                    createMutation.reset();
                  }}
                  className="text-sm text-slate-400 cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-violet-900/40 file:text-violet-300 hover:file:bg-violet-900/60"
                />
              </div>
              {image && (
                <p className="text-xs text-slate-500">📎 {image.name}</p>
              )}

              {createMutation.isError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-400 font-medium">
                    {((createMutation.error as any).response?.data?.errors?.[0]?.message) || 
                     ((createMutation.error as any).response?.data?.message) || 
                     "Failed to publish post"}
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "auto", padding: "0.65rem 1.8rem" }}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Publishing…" : "Publish Post"}
              </button>
            </form>
          </div>
        )}

        {/* Blog Grid */}
        {isLoading && (
          <div className="text-center text-slate-500 py-20">
            <div className="text-4xl mb-4 animate-spin inline-block">⟳</div>
            <p>Loading posts…</p>
          </div>
        )}

        {isError && (
          <div className="text-center text-red-400 py-20">
            <p>Failed to load blogs. Please try again.</p>
          </div>
        )}

        {!isLoading && !isError && blogs?.length === 0 && (
          <div className="text-center py-20 fade-in">
            <div className="text-6xl mb-5">📭</div>
            <p className="text-slate-500 text-lg">No blog posts yet.</p>
            <p className="text-slate-600 text-sm mt-1">Be the first to create one!</p>
          </div>
        )}

        {!isLoading && blogs && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
