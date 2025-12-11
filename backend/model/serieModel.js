// models/seriesModel.js
import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  downloadUrl: { type: String, required: true },
  streamUrl: { type: String, required: true },
  externalUrl: { type: String, required: true },
  fileSize: { type: String, required: true },
});

const seasonSchema = new mongoose.Schema({
  seasonName: { type: String, required: true },
  episodes: [episodeSchema],
});

const seriesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    seasons: [seasonSchema],
  },
  {
    timestamps: true,
  }
);

const Series = mongoose.model('Series', seriesSchema);

export default Series;
