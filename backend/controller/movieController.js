import Movie from '../model/movieModel.js'
import Series from '../model/serieModel.js'

export const uploadMovie = async (req, res) => {
    try {
        const { title, downloadUrl, streamUrl, externalUrl, fileSize } = req.body
        
        if (!title || !downloadUrl || !streamUrl || !externalUrl || !fileSize) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: title, downloadUrl, streamUrl, externalUrl, fileSize' 
            })
        }

        // Check if externalUrl already exists
        const existingMovie = await Movie.findOne({ externalUrl })
        if (existingMovie) {
            return res.status(409).json({ 
                success: false, 
                message: 'Movie with this external URL already exists' 
            })
        }

        const newMovie = new Movie({
            title,
            downloadUrl,
            streamUrl,
            externalUrl,
            fileSize
        })

        const savedMovie = await newMovie.save()
        
        return res.status(201).json({ 
            success: true, 
            message: 'Movie uploaded successfully', 
            movie: savedMovie 
        })
    } catch (err) {
        console.error('Error uploading movie:', err)
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        })
    }
}


export const getMovieByExternalUrl = async (req, res) => {
    try {
        let { externalUrl } = req.query;

        if (!externalUrl) {
            return res.status(400).json({
                success: false,
                message: 'externalUrl query parameter is required'
            });
        }

        // Decode encoded URLs like http%3A%2F%2Fexample.com%2FserieA
        externalUrl = decodeURIComponent(externalUrl);

        // 1. First, try to find a movie
        const movie = await Movie.findOne({ externalUrl });

        if (movie) {
            return res.status(200).json({
                success: true,
                movie: movie,
                contentType: 'movie'
            });
        }

        // 2. If not a movie, try to find a series episode
        const series = await Series.findOne({
            'seasons.episodes.externalUrl': externalUrl
        });


        if (series) {
            // Find the specific episode
            let foundEpisode = null;
            let foundSeason = null;
            
            for (const season of series.seasons) {
                const episode = season.episodes.find(ep => ep.externalUrl === externalUrl);
                if (episode) {
                    foundEpisode = episode;
                    foundSeason = season;
                    break;
                }
            }

            if (foundEpisode) {
                // Create a flattened episode object with movie-like structure
                const episodeAsMovie = {
                    _id: foundEpisode._id,
                    title: `${series.title} - ${foundSeason.seasonName} - ${foundEpisode.title}`,
                    seriesTitle: series.title,
                    seasonName: foundSeason.seasonName,
                    episodeName: foundEpisode.title,
                    downloadUrl: foundEpisode.downloadUrl,
                    streamUrl: foundEpisode.streamUrl,
                    externalUrl: foundEpisode.externalUrl,
                    fileSize: foundEpisode.fileSize,
                    createdAt: series.createdAt,
                    updatedAt: series.updatedAt,
                    seriesId: series._id,
                    seasonId: foundSeason._id
                };

                return res.status(200).json({
                    success: true,
                    movie: episodeAsMovie, // Still call it "movie" for frontend compatibility
                    contentType: 'series'
                });
            }
        }

        // 3. If nothing found
        return res.status(404).json({
            success: false,
            message: 'Content not found'
        });
    } catch (err) {
        console.error('Error getting content by external URL:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 })
        
        return res.status(200).json({ 
            success: true, 
            movies,
            count: movies.length
        })
    } catch (err) {
        console.error('Error getting movies:', err)
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        })
    }
}

export const updateMovie = async (req, res) => {
    try {
        const { id } = req.params
        const { title, downloadUrl, streamUrl, externalUrl } = req.body
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Movie ID is required' 
            })
        }

        // Only allow updating title and URLs
        const updateData = {}
        if (title) updateData.title = title
        if (downloadUrl) updateData.downloadUrl = downloadUrl
        if (streamUrl) updateData.streamUrl = streamUrl
        if (externalUrl) updateData.externalUrl = externalUrl

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No valid fields to update' 
            })
        }

        // Check if externalUrl is being updated and if it already exists
        if (externalUrl) {
            const existingMovie = await Movie.findOne({ 
                externalUrl, 
                _id: { $ne: id } 
            })
            if (existingMovie) {
                return res.status(409).json({ 
                    success: false, 
                    message: 'Movie with this external URL already exists' 
                })
            }
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )

        if (!updatedMovie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            })
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Movie updated successfully', 
            movie: updatedMovie 
        })
    } catch (err) {
        console.error('Error updating movie:', err)
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        })
    }
}

export const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Movie ID is required' 
            })
        }

        const deletedMovie = await Movie.findByIdAndDelete(id)
        
        if (!deletedMovie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            })
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Movie deleted successfully' 
        })
    } catch (err) {
        console.error('Error deleting movie:', err)
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        })
    }
}




export const directDownload = async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("URL required");

    try {
        const response = await axios.get(url, { responseType: "stream" });
        res.setHeader("Content-Disposition", 'attachment; filename="movie.mp4"');
        response.data.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Download failed");
    }
}

export const getDownloadUrl = async (req, res) => {
    try {
        const { id } = req.params
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Movie ID is required' 
            })
        }

        const movie = await Movie.findById(id).select('downloadUrl title')
        
        if (!movie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            })
        }

        return res.status(200).json({ 
            success: true, 
            downloadUrl: movie.downloadUrl,
            title: movie.title
        })
    } catch (err) {
        console.error('Error getting download URL:', err)
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        })
    }
}

export const getStreamUrl = async (req, res) => {
    try {
        const { id } = req.params
        
        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: 'Movie ID is required' 
            })
        }

        const movie = await Movie.findById(id).select('streamUrl title')
        
        if (!movie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            })
        }

        return res.status(200).json({ 
            success: true, 
            streamUrl: movie.streamUrl,
            title: movie.title
        })
    } catch (err) {
        console.error('Error getting stream URL:', err)
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        })
    }
}
