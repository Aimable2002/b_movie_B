import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMovies, addMovie, updateMovie, deleteMovie, type Movie } from "../data/mockMovies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, LogOut, Film, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    downloadUrl: "",
    streamUrl: "",
    externalUrl: "",
    fileSize: ""
  });

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const fetchedMovies = await getMovies();
      setMovies(fetchedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      downloadUrl: "",
      streamUrl: "",
      externalUrl: "",
      fileSize: ""
    });
    setEditingMovie(null);
  };

  const handleOpenDialog = (movie?: Movie) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        title: movie.title,
        downloadUrl: movie.downloadUrl,
        streamUrl: movie.streamUrl,
        externalUrl: movie.externalUrl,
        fileSize: movie.fileSize
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingMovie) {
        await updateMovie(editingMovie._id, {
          title: formData.title,
          downloadUrl: formData.downloadUrl,
          streamUrl: formData.streamUrl,
          externalUrl: formData.externalUrl
        });
        toast.success("Movie updated successfully");
      } else {
        await addMovie({
          title: formData.title,
          downloadUrl: formData.downloadUrl,
          streamUrl: formData.streamUrl,
          externalUrl: formData.externalUrl,
          fileSize: formData.fileSize
        });
        toast.success("Movie added successfully");
      }
      
      await fetchMovies();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Error saving movie:", error);
      toast.error(error.message || "Failed to save movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) {
      return;
    }

    try {
      const success = await deleteMovie(id);
      if (success) {
        toast.success("Movie deleted successfully");
        await fetchMovies();
      } else {
        toast.error("Failed to delete movie");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Film className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Movie Management</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Movie
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Movie title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="downloadUrl">Download URL</Label>
                      <Input
                        id="downloadUrl"
                        value={formData.downloadUrl}
                        onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                        placeholder="https://..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="streamUrl">Streaming URL</Label>
                      <Input
                        id="streamUrl"
                        value={formData.streamUrl}
                        onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                        placeholder="https://..."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="externalUrl">External URL</Label>
                      <Input
                        id="externalUrl"
                        value={formData.externalUrl}
                        onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                        placeholder="https://websiteA.com/movies/..."
                        required
                      />
                    </div>
                    {!editingMovie && (
                      <div className="space-y-2">
                        <Label htmlFor="fileSize">File Size</Label>
                        <Input
                          id="fileSize"
                          value={formData.fileSize}
                          onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                          placeholder="1.2 GB"
                          required
                        />
                      </div>
                    )}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)} 
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {editingMovie ? "Updating..." : "Adding..."}
                          </>
                        ) : (
                          `${editingMovie ? "Update" : "Add"} Movie`
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>File Size</TableHead>
                      <TableHead>External URL</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No movies found. Add your first movie!
                        </TableCell>
                      </TableRow>
                    ) : (
                      movies.map((movie) => (
                        <TableRow key={movie._id}>
                          <TableCell className="font-medium">{movie.title}</TableCell>
                          <TableCell>{movie.fileSize}</TableCell>
                          <TableCell className="max-w-xs truncate">{movie.externalUrl}</TableCell>
                          <TableCell>
                            {movie.createdAt 
                              ? new Date(movie.createdAt).toLocaleDateString()
                              : "-"
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenDialog(movie)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDelete(movie._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
