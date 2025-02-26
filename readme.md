# Leaderboard Voting API

A simple ranking system where users can vote for participants, and the leaderboard updates dynamically.

## Features
- **Vote System**: Users vote (score 1-100) for participants.
- **Leaderboard Ranking**: Scores are aggregated, and participants are ranked dynamically.
- **Vote Updates**: Latest vote per user is considered.
- **Scalability**: Handles high traffic efficiently.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Frontend**: React.js (Example provided)

## Installation

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (Locally or via MongoDB Atlas)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/theashu02/leaderboard_algo
   cd leaderboard_algo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```sh
   DB_URL=your_mongodb_connection_string
   PORT=5000
   ```
4. Run the server:
   ```sh
   npm run dev
   ```

## API Endpoints

### 1. Submit or Update a Vote
**Endpoint:** `POST /vote`

**Request Body:**
```json
{
  "voterId": "user123",
  "participantId": "player456",
  "score": 85
}
```
**Response:**
```json
{
  "message": "Vote recorded successfully"
}
```

### 2. Get Leaderboard
**Endpoint:** `GET /leaderboard`

**Response:**
```json
[
  { "rank": 1, "participant": "player456", "score": 250 },
  { "rank": 2, "participant": "player789", "score": 200 }
]
```

## Running the Frontend
An example React frontend is available. Install dependencies and run:
```sh
cd frontend
npm install
npm run dev
```

## Future Enhancements
- WebSockets for real-time updates.
- More robust anti-manipulation measures.
- Pagination for large leaderboards.

## License
This project is open-source under the MIT License.

---
### 🚀 Enjoy coding and optimize rankings efficiently!

