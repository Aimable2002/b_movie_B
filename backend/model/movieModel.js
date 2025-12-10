import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    downloadUrl: { type: String, required: true },
    streamUrl: { type: String, required: true },
    externalUrl: { type: String, required: true },
    fileSize: { type: String, required: true }
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
