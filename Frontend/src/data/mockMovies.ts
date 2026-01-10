const API_BASE_URL = import.meta.env.VITE_API_URL || "https://b-movie-b.onrender.com/api";  // https://agasobanuye-yrqs.onrender.com/api
export interface Movie {
  _id: string;
  title: string;
  downloadUrl: string;
  streamUrl: string;
  externalUrl: string;
  fileSize: string;
  createdAt?: string;
  updatedAt?: string;
  seriesTitle?: string;
  seasonName?: string;
  episodeName?: string;
  seriesId?: string;
  seasonId?: string;
}

export interface Series {
  _id: string;
  title: string; // This is now the combined title or seriesTitle
  seriesTitle?: string; // Add this
  seasonName?: string;
  episodeName?: string;
  downloadUrl?: string;
  streamUrl?: string;
  externalUrl: string;
  fileSize?: string;
  createdAt?: string;
  updatedAt?: string;
  seriesId?: string; // Add this
  seasonId?: string; // Add this
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


const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


export const getSeries = async (): Promise<Series[]> => {
  try {
    console.log('get all series')
    const response = await fetch(`${API_BASE_URL}/series/all`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (data.success) {
      return data.series || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching series:", error);
    return [];
  }
};

export const addSeries = async (series: {
  title: string;
  externalUrl: string;
  seasonName?: string;
  episodeName?: string;
  downloadUrl?: string;
  streamUrl?: string;
  fileSize?: string;
}): Promise<Series | null> => {
  try {
    console.log('series to be added :', series)
    const response = await fetch(`${API_BASE_URL}/series/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(series),
    });

    const data = await response.json();
    if (data.success) {
      return data.series;
    }
    throw new Error(data.message || "Failed to add series");
  } catch (error) {
    console.error("Error adding series:", error);
    throw error;
  }
};


export const updateSeries = async (id: string, updates: Partial<Pick<Series, 'title' | 'seasonName' | 'episodeName' | 'downloadUrl' | 'streamUrl' | 'externalUrl' | 'fileSize'>>): Promise<Series | null> => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/series/update/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        seriesTitle: updates.title, 
        seasonName: updates.seasonName,
        episodeName: updates.episodeName,
        downloadUrl: updates.downloadUrl,
        streamUrl: updates.streamUrl,
        externalUrl: updates.externalUrl,
        fileSize: updates.fileSize
      }),
    });

    const data = await response.json();
    if (data.success) {
      return data.episode; 
    }
    throw new Error(data.message || "Failed to update episode");
  } catch (error) {
    console.error("Error updating series episode:", error);
    throw error;
  }
};

export const deleteSeries = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/series/delete/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Error deleting series:", error);
    return false;
  }
};
