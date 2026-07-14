import React, { useState } from "react";
import { Blog } from "../../domain/models/Blog";
import { useAuthStore } from "../../application/state/authStore";
import { useDeleteBlogMutation, useUpdateBlogMutation } from "../../application/queries/useBlogQueries";
import { Textarea } from "./ui/Textarea";
import { Input } from "./ui/Input";

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const { user } = useAuthStore();
  const isOwner = user?.id === blog.authorId;
  const deleteMutation = useDeleteBlogMutation();
  const updateMutation = useUpdateBlogMutation();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [image, setImage] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; content?: string }>({});

  const handleUpdate = () => {
    const errors: { title?: string; content?: string } = {};
    if (title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    } else if (title.trim().length > 100) {
      errors.title = "Title cannot exceed 100 characters";
    }
    if (content.trim().length < 10) {
      errors.content = "Content must be at least 10 characters";
    } else if (content.trim().length > 5000) {
      errors.content = "Content cannot exceed 5000 characters";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    updateMutation.mutate(
      { 
        id: blog.id, 
        data: { 
          title: title.trim(), 
          content: content.trim(), 
          image: image ?? undefined 
        } 
      },
      { 
        onSuccess: () => {
          setIsEditModalOpen(false);
          setImage(null); // Clear selected image after success
        } 
      }
    );
  };

  const responseData = (updateMutation.error as any)?.response?.data;
  const validationErrors = responseData?.errors || [];
  const titleError = fieldErrors.title || validationErrors.find((e: any) => e.field === "title")?.message;
  const contentError = fieldErrors.content || validationErrors.find((e: any) => e.field === "content")?.message;
  const imageError = validationErrors.find((e: any) => e.field === "image")?.message || 
                     (responseData?.message?.toLowerCase().includes("file") || responseData?.message?.toLowerCase().includes("image") || responseData?.message?.toLowerCase().includes("allowed") ? responseData?.message : null);

  const getSummaryErrors = (): string[] => {
    const list: string[] = [];
    if (fieldErrors.title) list.push(fieldErrors.title);
    if (fieldErrors.content) list.push(fieldErrors.content);
    if (validationErrors.length > 0) {
      validationErrors.forEach((e: any) => {
        if (e.message) list.push(e.message);
      });
    } else if (responseData?.message) {
      list.push(responseData.message);
    } else if (updateMutation.error) {
      list.push((updateMutation.error as any).message || "Update failed");
    }
    return list;
  };

  const getImageUrl = () => {
    if (!blog.imageUrl) return null;
    if (blog.imageUrl.startsWith("http")) return blog.imageUrl;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${baseUrl}${blog.imageUrl}`;
  };

  const imageUrl = getImageUrl();

  return (
    <>
      <div className="glass-card p-5 fade-in flex flex-col h-full relative group transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]">
        <div className="cursor-pointer flex-1" onClick={() => setIsReadModalOpen(true)}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-44 object-cover rounded-xl mb-4 group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-44 rounded-xl mb-4 flex items-center justify-center bg-white/5 border border-white/5">
              <span className="text-4xl opacity-50">📝</span>
            </div>
          )}

          <h3 className="text-lg font-semibold text-white mb-2 leading-snug group-hover:text-violet-400 transition-colors">
            {blog.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
            {blog.content}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-600">
            {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
          </span>
          <div className="flex gap-2 items-center">
            {isOwner && (
              <div className="flex gap-1">
                <button 
                  className="text-[11px] text-slate-500 hover:text-white transition-colors px-2 py-1" 
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit
                </button>
                <button
                  className="text-[11px] text-slate-500 hover:text-red-400 transition-colors px-2 py-1"
                  onClick={() => deleteMutation.mutate(blog.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "..." : "Delete"}
                </button>
              </div>
            )}
            <div className="h-3 w-[1px] bg-white/5 mx-1" />
            <button 
              className="text-xs text-violet-400 hover:text-violet-300 font-medium px-2 py-1"
              onClick={() => setIsReadModalOpen(true)}
            >
              Read More
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL (New Post Style) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in" onClick={() => setIsEditModalOpen(false)}>
          <div className="glass-card max-w-xl w-full p-8 relative animate-fade-up" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-violet-500">✎</span> Edit Blog Post
            </h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-5">
              <Input
                label="Title"
                id={`edit-title-${blog.id}`}
                maxLength={100}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFieldErrors(prev => ({ ...prev, title: undefined }));
                  updateMutation.reset(); 
                }}
                placeholder="Enter blog title..."
                error={titleError}
              />
              <Textarea
                label="Content"
                id={`edit-content-${blog.id}`}
                maxLength={5000}
                value={content}
                rows={4}
                onChange={(e) => {
                  setContent(e.target.value);
                  setFieldErrors(prev => ({ ...prev, content: undefined }));
                  updateMutation.reset(); 
                }}
                placeholder="Write your blog content..."
                error={contentError}
              />

              <div>
                <label className="label">Change Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImage(e.target.files?.[0] ?? null);
                    updateMutation.reset();
                  }}
                  className="text-xs text-slate-400 cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-violet-900/40 file:text-violet-300 hover:file:bg-violet-900/60 transition-all"
                />
                {imageError && <p className="error-msg mt-1.5">{imageError}</p>}
                {image && !imageError && <p className="text-[10px] text-violet-400 mt-2 font-medium">📎 Selected: {image.name}</p>}
              </div>

              {(fieldErrors.title || fieldErrors.content || updateMutation.isError) && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 space-y-1">
                  {getSummaryErrors().map((msg, index) => (
                    <p key={index} className="text-xs text-red-400">
                      • {msg}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "auto", padding: "0.65rem 1.5rem" }}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Update Post"}
                </button>
                <button 
                  type="button"
                  className="btn-ghost" 
                  style={{ width: "auto", padding: "0.65rem 1.5rem" }}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* READ MORE MODAL */}
      {isReadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-fade-in" onClick={() => setIsReadModalOpen(false)}>
          <div className="bg-[#12121e] border border-white/5 max-w-xl w-full max-h-[80vh] overflow-y-auto rounded-[2rem] p-0 relative animate-fade-up scrollbar-hide shadow-[0_0_50px_rgba(0,0,0,0.5)]" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/40 transition-all duration-300 border border-white/5 text-xs"
              onClick={() => setIsReadModalOpen(false)}
            >✕</button>
            {imageUrl && (
              <div className="relative w-full h-[240px]">
                <img src={imageUrl} alt={blog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121e] via-transparent to-black/10" />
              </div>
            )}
            <div className={`px-8 pb-10 ${!imageUrl ? 'pt-12' : 'pt-4'}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[9px] text-violet-400 font-bold uppercase tracking-wider">Story</span>
                <div className="h-1 w-1 rounded-full bg-slate-700" />
                <span className="text-[10px] text-slate-500 font-medium">
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ""}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight tracking-tight">{blog.title}</h2>
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-base font-normal">{blog.content}</div>
              </div>
              <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  {blog.authorName?.[0]?.toUpperCase() || "A"}
                </div>
                <div>
                  <p className="text-white font-semibold text-xs">Published by</p>
                  <p className="text-slate-500 text-[10px]">{blog.authorName || "Anonymous Author"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
