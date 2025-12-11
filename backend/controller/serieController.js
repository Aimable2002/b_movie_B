// controllers/seriesController.js
import Series from '../model/serieModel.js';

// Get all series
export const getAllSeries = async (req, res) => {
  try {
    const series = await Series.find().populate('seasons episodes');
    return res.status(200).json({
      success: true,
      series,
      count: series.length,
    });
  } catch (err) {
    console.error('Error getting all series:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get series by ID
export const getSeriesById = async (req, res) => {
  try {
    const series = await Series.findById(req.params.id).populate('seasons episodes');
    if (!series) {
      return res.status(404).json({
        success: false,
        message: 'Series not found',
      });
    }
    return res.status(200).json({
      success: true,
      series,
    });
  } catch (err) {
    console.error('Error getting series by ID:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Create a new series
export const createSeries = async (req, res) => {
  try {
    const { title, seasons } = req.body;

    if (!title || !seasons) {
      return res.status(400).json({
        success: false,
        message: 'Title and seasons are required',
      });
    }

    const newSeries = new Series({
      title,
      seasons,
    });

    const savedSeries = await newSeries.save();
    return res.status(201).json({
      success: true,
      message: 'Series created successfully',
      series: savedSeries,
    });
  } catch (err) {
    console.error('Error creating series:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update series by ID
export const updateSeries = async (req, res) => {
  try {
    const { title, seasons } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (seasons) updateData.seasons = seasons;

    const updatedSeries = await Series.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSeries) {
      return res.status(404).json({
        success: false,
        message: 'Series not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Series updated successfully',
      series: updatedSeries,
    });
  } catch (err) {
    console.error('Error updating series:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete series by ID
export const deleteSeries = async (req, res) => {
  try {
    const deletedSeries = await Series.findByIdAndDelete(req.params.id);
    if (!deletedSeries) {
      return res.status(404).json({
        success: false,
        message: 'Series not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Series deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting series:', err);
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
    return res.status(200).json({
      success: true,
      season,
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
    return res.status(200).json({
      success: true,
      episode,
    });
  } catch (err) {
    console.error('Error getting episode by ID:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
