const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { Heap } = require('heap-js');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        await updateLeaderboard(); // Update leaderboard after DB connection
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};

connectDB();

const Vote = mongoose.model("Vote", new mongoose.Schema({
    voterId: String,
    participantId: String,
    score: Number,
}, { timestamps: true }));

const app = express();
app.use(cors());
app.use(express.json());

const leaderboardHeap = new Heap((a, b) => b.score - a.score); // Max-Heap
const participantScores = new Map();

// Update the leaderboard from the database
async function updateLeaderboard() {
    leaderboardHeap.clear();
    participantScores.clear();

    const results = await Vote.aggregate([
        { $group: { _id: "$participantId", totalScore: { $sum: "$score" } } },
    ]);

    results.forEach(({ _id, totalScore }) => {
        participantScores.set(_id, totalScore);
        leaderboardHeap.push({ participant: _id, score: totalScore });
    });
}

// API to vote
app.post("/vote", async (req, res) => {
    const { voterId, participantId, score } = req.body;
    if (!voterId || !participantId || score < 1 || score > 100)
        return res.status(400).json({ error: "Invalid Input" });

    let existingVote = await Vote.findOne({ voterId, participantId });
    if (existingVote) {
        const oldScore = existingVote.score;
        existingVote.score = score;
        await existingVote.save();

        // Adjust the participant's score
        participantScores.set(participantId, (participantScores.get(participantId) || 0) - oldScore + score);
    } else {
        await Vote.create({ voterId, participantId, score });
        participantScores.set(participantId, (participantScores.get(participantId) || 0) + score);
    }

    // Update leaderboard heap
    leaderboardHeap.clear();
    participantScores.forEach((score, participant) => {
        leaderboardHeap.push({ participant, score });
    });

    res.json({ message: "Vote recorded successfully!" });
});

// API to fetch leaderboard
app.get("/leaderboard", async (req, res) => {
    let sortedLeaderboard = leaderboardHeap.toArray().slice(0, 10);
    sortedLeaderboard = sortedLeaderboard.map((entry, index) => ({
        rank: index + 1,
        participant: entry.participant,
        score: entry.score,
    }));

    res.json(sortedLeaderboard);
});

app.listen(process.env.PORT, () => console.log(`Server listening ${process.env.PORT}`));
