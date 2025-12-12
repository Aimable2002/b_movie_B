import Series from '../model/serieModel.js';

// Helper function to format data (optional)
const formatSeriesData = (series) => {
  return {
    id: series._id,  // Use `id` instead of `_id` for consistency with frontend
    title: series.title,
    seasons: series.seasons.map((season) => ({
      id: season._id,
      seasonName: season.seasonName,
      episodes: season.episodes.map((episode) => ({
        id: episode._id,
        title: episode.title,
        downloadUrl: episode.downloadUrl,
        streamUrl: episode.streamUrl,
        externalUrl: episode.externalUrl,
        fileSize: episode.fileSize,
      })),
    })),
  };
};

export const getAllSeries = async (req, res) => {
    try {
        const series = await Series.find();
        
        // Flatten the nested structure into a single array of episodes
        const flattenedEpisodes = series.flatMap(seriesItem => 
            seriesItem.seasons.flatMap(season => 
                season.episodes.map(episode => ({
                    _id: episode._id,
                    seriesTitle: seriesItem.title,
                    seasonName: season.seasonName,
                    episodeName: episode.title,
                    title: `${seriesItem.title} - ${season.seasonName} - ${episode.title}`,
                    downloadUrl: episode.downloadUrl,
                    streamUrl: episode.streamUrl,
                    externalUrl: episode.externalUrl,
                    fileSize: episode.fileSize,
                    createdAt: seriesItem.createdAt,
                    updatedAt: seriesItem.updatedAt,
                    seriesId: seriesItem._id,
                    seasonId: season._id
                }))
            )
        );
        
        return res.status(200).json({
            success: true,
            series: flattenedEpisodes,
            count: flattenedEpisodes.length,
        });
    } catch (err) {
        console.error('Error getting all series:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const getSeriesById = async (req, res) => {
    try {
        const series = await Series.findOne({ 'seasons.episodes._id': req.params.id });
        
        if (!series) {
            return res.status(404).json({
                success: false,
                message: 'Episode not found',
            });
        }
        
        // Find the specific episode
        let foundEpisode = null;
        let foundSeason = null;
        
        for (const season of series.seasons) {
            const episode = season.episodes.find(ep => ep._id.toString() === req.params.id);
            if (episode) {
                foundEpisode = episode;
                foundSeason = season;
                break;
            }
        }
        
        if (!foundEpisode) {
            return res.status(404).json({
                success: false,
                message: 'Episode not found',
            });
        }
        
        // Return flattened episode with series context
        const flattenedEpisode = {
            _id: foundEpisode._id,
            seriesTitle: series.title,
            seasonName: foundSeason.seasonName,
            episodeName: foundEpisode.title,
            title: `${series.title} - ${foundSeason.seasonName} - ${foundEpisode.title}`,
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
            episode: flattenedEpisode,
        });
    } catch (err) {
        console.error('Error getting episode by ID:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
  

// Create a new series
export const createSeries = async (req, res) => {
  try {
    const {
      title,
      seasonName,
      episodeName,
      externalUrl,
      downloadUrl,
      streamUrl,
      fileSize,
    } = req.body;

    if (!title || !seasonName || !episodeName || !externalUrl || !downloadUrl || !streamUrl || !fileSize) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    // Create a new episode object
    const newEpisode = {
      title: episodeName,
      downloadUrl,
      streamUrl,
      externalUrl,
      fileSize,
    };

    // Create a new season object
    const newSeason = {
      seasonName,
      episodes: [newEpisode],
    };

    // Create the series object and save it
    const newSeries = new Series({
      title,
      seasons: [newSeason],
    });

    const savedSeries = await newSeries.save();

    const formattedSeries = formatSeriesData(savedSeries);
    return res.status(201).json({
      success: true,
      message: 'Series created successfully',
      series: formattedSeries,
    });
  } catch (err) {
    console.error('Error creating series:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateSeries = async (req, res) => {
    try {
      const { 
        seriesTitle, 
        seasonName, 
        episodeName, 
        downloadUrl, 
        streamUrl, 
        externalUrl, 
        fileSize
      } = req.body;

      const series = await Series.findOne({ 'seasons.episodes._id': req.params.id });
      
      if (!series) {
        return res.status(404).json({ success: false, message: 'Episode not found'});
      }
      if (seriesTitle) {
        series.title = seriesTitle;
      }
  
      let episodeUpdated = false;
      
      for (const season of series.seasons) {
        const episodeIndex = season.episodes.findIndex(ep => ep._id.toString() === req.params.id);
        
        if (episodeIndex !== -1) {
          if (seasonName) {
            season.seasonName = seasonName;
          }
          const episode = season.episodes[episodeIndex];
          
          if (episodeName) episode.title = episodeName;
          if (downloadUrl) episode.downloadUrl = downloadUrl;
          if (streamUrl) episode.streamUrl = streamUrl;
          if (externalUrl) episode.externalUrl = externalUrl;
          if (fileSize) episode.fileSize = fileSize;
          
          episodeUpdated = true;
          break;
        }
      }
      
      if (!episodeUpdated) {
        return res.status(404).json({ success: false, message: 'Episode not found in series'});
      }
  
      await series.save();
      let updatedEpisode = null;
      let foundSeason = null;
      
      for (const season of series.seasons) {
        const episode = season.episodes.find(ep => ep._id.toString() === req.params.id);
        if (episode) {
          updatedEpisode = episode;
          foundSeason = season;
          break;
        }
      }
  
      const flattenedEpisode = {
        _id: updatedEpisode._id,
        seriesTitle: series.title,
        seasonName: foundSeason.seasonName,
        episodeName: updatedEpisode.title,
        title: `${series.title} - ${foundSeason.seasonName} - ${updatedEpisode.title}`,
        downloadUrl: updatedEpisode.downloadUrl,
        streamUrl: updatedEpisode.streamUrl,
        externalUrl: updatedEpisode.externalUrl,
        fileSize: updatedEpisode.fileSize,
        createdAt: series.createdAt,
        updatedAt: series.updatedAt,
        seriesId: series._id,
        seasonId: foundSeason._id
      };
      
      return res.status(200).json({success: true, message: 'Episode updated successfully', episode: flattenedEpisode});
    } catch (err) {
      console.error('Error updating series episode:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

// Delete series by ID
export const deleteSeries = async (req, res) => {
    try {
      const series = await Series.findOne({ 'seasons.episodes._id': req.params.id });
      
      if (!series) {
        return res.status(404).json({success: false, message: 'Episode not found'});
      }
  
      let episodeDeleted = false;
      for (const season of series.seasons) {
        const initialEpisodeCount = season.episodes.length;
        season.episodes = season.episodes.filter(ep => ep._id.toString() !== req.params.id);
        
        if (season.episodes.length < initialEpisodeCount) {
          episodeDeleted = true;
          
          if (season.episodes.length === 0) {
            series.seasons = series.seasons.filter(s => s._id.toString() !== season._id.toString());
          }
          break;
        }
      }
      
      if (!episodeDeleted) {
        return res.status(404).json({ success: false, message: 'Episode not found in series'});
      }
      await series.save();
  
      if (series.seasons.length === 0) {
        await Series.findByIdAndDelete(series._id);
        return res.status(200).json({ success: true, message: 'Series deleted (no seasons remaining)' });
      }
  
      return res.status(200).json({success: true, message: 'Episode deleted successfully'});
    } catch (err) {
      console.error('Error deleting series episode:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
};

// Get a specific season by ID
export const getSeasonById = async (req, res) => {
  try {
    const season = await Series.findOne({ 'seasons._id': req.params.id }).select('seasons');
    if (!season) {
      return res.status(404).json({
        success: false,
        message: 'Season not found',
      });
    }

    const formattedSeason = season.seasons.map(season => ({
      id: season._id,
      seasonName: season.seasonName,
      episodes: season.episodes.map((episode) => ({
        id: episode._id,
        title: episode.title,
        downloadUrl: episode.downloadUrl,
        streamUrl: episode.streamUrl,
        externalUrl: episode.externalUrl,
        fileSize: episode.fileSize,
      })),
    }));

    return res.status(200).json({
      success: true,
      season: formattedSeason,
    });
  } catch (err) {
    console.error('Error getting season by ID:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get a specific episode by ID
export const getEpisodeById = async (req, res) => {
  try {
    const episode = await Series.findOne({ 'seasons.episodes._id': req.params.id }).select('seasons.episodes');
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode not found',
      });
    }

    const formattedEpisode = episode.seasons.flatMap((season) => 
      season.episodes.filter((ep) => ep._id.toString() === req.params.id)
    );

    return res.status(200).json({
      success: true,
      episode: formattedEpisode[0],
    });
  } catch (err) {
    console.error('Error getting episode by ID:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
