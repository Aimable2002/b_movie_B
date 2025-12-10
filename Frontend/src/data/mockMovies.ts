const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Movie {
  _id: string;
  title: string;
  downloadUrl: string;
  streamUrl: string;
  externalUrl: string;
  fileSize: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getMovies = async (): Promise<Movie[]> => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/movie/all`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.movies || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const getMovieByExternalUrl = async (externalUrl: string): Promise<Movie | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movie/get/movie?externalUrl=${encodeURIComponent(externalUrl)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.movie;
    }
    return null;
  } catch (error) {
    console.error("Error fetching movie by external URL:", error);
    return null;
  }
};

export const addMovie = async (movie: Omit<Movie, '_id' | 'createdAt' | 'updatedAt'>): Promise<Movie | null> => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/movie/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: movie.title,
        downloadUrl: movie.downloadUrl,
        streamUrl: movie.streamUrl,
        externalUrl: movie.externalUrl,
        fileSize: movie.fileSize,
      }),
    });

    const data = await response.json();
    if (data.success) {
      return data.movie;
    }
    throw new Error(data.message || "Failed to add movie");
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

export const updateMovie = async (id: string, updates: Partial<Pick<Movie, 'title' | 'downloadUrl' | 'streamUrl' | 'externalUrl'>>): Promise<Movie | null> => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/movie/update/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (data.success) {
      return data.movie;
    }
    throw new Error(data.message || "Failed to update movie");
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};

export const deleteMovie = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/movie/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Error deleting movie:", error);
    return false;
  }
};

export const getDownloadUrl = async (id: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movie/download/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.downloadUrl;
    }
    return null;
  } catch (error) {
    console.error("Error getting download URL:", error);
    return null;
  }
};

export const getStreamUrl = async (id: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movie/stream/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      return data.streamUrl;
    }
    return null;
  } catch (error) {
    console.error("Error getting stream URL:", error);
    return null;
  }
};
