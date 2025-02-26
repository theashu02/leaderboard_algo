import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://leaderboard-algo.onrender.com";

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [voterId, setVoterId] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [score, setScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_URL}/leaderboard`);
      setLeaderboard(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to fetch leaderboard", type: "error" });
    }
  };

  const submitVote = async () => {
    if (!voterId || !participantId || !score) {
      setMessage({ text: "Please enter all fields", type: "error" });
      return;
    }

    if (parseInt(score) < 1 || parseInt(score) > 100) {
      setMessage({ text: "Score must be between 1 and 100", type: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/vote`, { voterId, participantId, score: parseInt(score) });
      setMessage({ text: "Vote submitted successfully!", type: "success" });
      setVoterId("");
      setParticipantId("");
      setScore("");
      fetchLeaderboard();
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to submit vote", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };
   const getRankIcon = (rank) => {
     switch (rank) {
       case 1:
         return "🏆";
       case 2:
         return "🥈";
       case 3:
         return "🥉";
       default:
         return rank;
     }
   };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            Leaderboard API System Using Heap
          </h1> 
          <p className="text-gray-400 max-w-2xl mx-auto">
            Vote for your favorite participants and track their standings in
            real-time
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Leaderboard Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg lg:col-span-3 overflow-hidden">
            <div className="border-b border-gray-700 p-4 md:p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-yellow-400">🏆</span>
                Current Rankings
              </h2>
            </div>
            <div className="p-0">
              {leaderboard.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="w-[80px] px-4 py-3 text-left">Rank</th>
                        <th className="px-4 py-3 text-left">Participant</th>
                        <th className="px-4 py-3 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map(({ rank, participant, score }) => (
                        <tr
                          key={participant}
                          className={`border-b border-gray-700 hover:bg-gray-700/50 ${
                            rank <= 3 ? "bg-gray-800/80" : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-medium">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/50">
                              {getRankIcon(rank)}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {participant}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="px-2 py-1 rounded bg-gray-700/50 font-mono">
                              {score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-500">
                  No rankings available yet
                </div>
              )}
            </div>
          </div>

          {/* Voting Form Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-lg lg:col-span-2 overflow-hidden">
            <div className="border-b border-gray-700 p-4 md:p-6">
              <h2 className="text-xl font-semibold">Submit Your Vote</h2>
              <p className="text-gray-400 text-sm mt-1">
                Support your favorite participant
              </p>
            </div>
            <div className="p-4 md:p-6">
              {message.text && (
                <div
                  className={`mb-4 p-3 rounded-md border ${
                    message.type === "success"
                      ? "bg-green-900/20 text-green-400 border-green-800"
                      : "bg-red-900/20 text-red-400 border-red-800"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="voterId"
                    className="block text-gray-300 text-sm font-medium"
                  >
                    Voter ID
                  </label>
                  <input
                    id="voterId"
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    placeholder="Enter your ID"
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="participantId"
                    className="block text-gray-300 text-sm font-medium"
                  >
                    Participant ID
                  </label>
                  <input
                    id="participantId"
                    type="text"
                    value={participantId}
                    onChange={(e) => setParticipantId(e.target.value)}
                    placeholder="Participant to vote for"
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="score"
                    className="block text-gray-300 text-sm font-medium"
                  >
                    Score (1-100)
                  </label>
                  <input
                    id="score"
                    type="number"
                    min="1"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Score between 1-100"
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 p-4 md:p-6">
              <button
                onClick={submitVote}
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Vote"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div>
    //   <div>
    //     <header>
    //       <h1>Competition Leaderboard</h1>
    //       <p>Vote for your favorite participants and track their standings</p>
    //     </header>

    //     <div>
    //       {/* Leaderboard Section */}
    //       <div>
    //         <div>
    //           <h2>Current Rankings</h2>
    //         </div>

    //         <div>
    //           {leaderboard.length > 0 ? (
    //             <table>
    //               <thead>
    //                 <tr>
    //                   <th>Rank</th>
    //                   <th>Participant</th>
    //                   <th>Score</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {leaderboard.map(({ rank, participant, score }) => (
    //                   <tr key={participant}>
    //                     <td>
    //                       <div>
    //                         {rank}
    //                       </div>
    //                     </td>
    //                     <td>{participant}</td>
    //                     <td>{score}</td>
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           ) : (
    //             <div>No rankings available yet</div>
    //           )}
    //         </div>
    //       </div>

    //       {/* Voting Form Section */}
    //       <div>
    //         <div>
    //           <h2>Submit Your Vote</h2>
    //         </div>

    //         <div>
    //           {message.text && (
    //             <div>
    //               {message.text}
    //             </div>
    //           )}

    //           <div>
    //             <div>
    //               <label htmlFor="voterId">Voter ID</label>
    //               <input
    //                 id="voterId"
    //                 type="text"
    //                 value={voterId}
    //                 onChange={(e) => setVoterId(e.target.value)}
    //                 placeholder="Enter your ID"
    //               />
    //             </div>

    //             <div>
    //               <label htmlFor="participantId">Participant ID</label>
    //               <input
    //                 id="participantId"
    //                 type="text"
    //                 value={participantId}
    //                 onChange={(e) => setParticipantId(e.target.value)}
    //                 placeholder="Participant to vote for"
    //               />
    //             </div>

    //             <div>
    //               <label htmlFor="score">Score (1-100)</label>
    //               <input
    //                 id="score"
    //                 type="number"
    //                 min="1"
    //                 max="100"
    //                 value={score}
    //                 onChange={(e) => setScore(e.target.value)}
    //                 placeholder="Score between 1-100"
    //               />
    //             </div>

    //             <button
    //               onClick={submitVote}
    //               disabled={isSubmitting}
    //             >
    //               {isSubmitting ? "Submitting..." : "Submit Vote"}
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default App;