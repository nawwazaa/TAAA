import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Clock, Users, Star, Target, Calendar, Plus, Bell, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  gameDate: string;
  gameTime: string;
  pointsReward: number;
}

const GamePredictions: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isRTL = i18n.language === 'ar';
  const [selectedPredictions, setSelectedPredictions] = useState<Record<string, string>>({});

  // Available games for prediction
  const availableGames: Game[] = [
    {
      id: 'game1',
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      league: 'Premier League',
      gameDate: 'January 25, 2024',
      gameTime: '15:00',
      pointsReward: 150
    },
    {
      id: 'game2',
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      league: 'La Liga',
      gameDate: 'January 26, 2024',
      gameTime: '20:00',
      pointsReward: 200
    },
    {
      id: 'game3',
      homeTeam: 'Bayern Munich',
      awayTeam: 'Borussia Dortmund',
      league: 'Bundesliga',
      gameDate: 'January 27, 2024',
      gameTime: '18:30',
      pointsReward: 180
    },
    {
      id: 'game4',
      homeTeam: 'Chelsea',
      awayTeam: 'Arsenal',
      league: 'Premier League',
      gameDate: 'January 28, 2024',
      gameTime: '16:00',
      pointsReward: 160
    },
    {
      id: 'game5',
      homeTeam: 'AC Milan',
      awayTeam: 'Inter Milan',
      league: 'Serie A',
      gameDate: 'January 29, 2024',
      gameTime: '19:45',
      pointsReward: 190
    }
  ];

  const handlePrediction = (gameId: string, prediction: string) => {
    setSelectedPredictions(prev => ({
      ...prev,
      [gameId]: prediction
    }));
  };

  const submitPredictions = () => {
    const submittedCount = Object.keys(selectedPredictions).length;
    if (submittedCount === 0) {
      alert('Please select at least one prediction before submitting!');
      return;
    }

    const totalPointsEarned = submittedCount * 50; // Base points for participation
    
    updateUser({
      flixbits: (user?.flixbits || 0) + totalPointsEarned
    });

    alert(`🎉 Predictions submitted successfully! You earned ${totalPointsEarned} Flixbits for participating!`);
    setSelectedPredictions({});
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🏆 Game Predictions Contest</h1>
        <p className="text-purple-100">Choose the winning teams and compete for amazing prizes!</p>
      </div>

      {/* Contest Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-2">🏆 Champions League Predictions</h2>
            <p className="text-blue-100">Pick the winners for each match to win the grand prize!</p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold">
              Prize: 25,000 Flixbits
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Your Flixbits</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{user?.flixbits.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 md:p-3 rounded-lg">
              <Star className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Predictions Made</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{Object.keys(selectedPredictions).length}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 md:p-3 rounded-lg">
              <Target className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Potential Earnings</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900">{Object.keys(selectedPredictions).length * 50}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 md:p-3 rounded-lg">
              <Trophy className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Games Prediction Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🎯 Choose Your Predictions
        </h2>
        
        <div className="space-y-6">
          {availableGames.map((game) => {
            const userPrediction = selectedPredictions[game.id];

            return (
              <div key={game.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all">
                {/* Game Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {game.homeTeam} vs {game.awayTeam}
                  </h3>
                  <div className="flex justify-center items-center space-x-6 rtl:space-x-reverse text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      <span className="font-medium">{game.gameDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      <span className="font-medium">{game.gameTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 text-yellow-500" />
                      <span className="font-medium text-yellow-600">+{game.pointsReward} Flixbits</span>
                    </div>
                  </div>
                  <p className="text-gray-500 mt-1">{game.league}</p>
                </div>

                {/* Team Selection Boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Home Team */}
                  <button
                    onClick={() => handlePrediction(game.id, 'home')}
                    className={`p-4 md:p-6 rounded-xl border-3 transition-all transform hover:scale-105 ${
                      userPrediction === 'home'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">🏠</div>
                      <h4 className="font-bold text-sm md:text-lg text-gray-900 mb-2">{game.homeTeam}</h4>
                      <p className="text-sm text-gray-600 mb-3">HOME TEAM</p>
                      {userPrediction === 'home' ? (
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs md:text-sm font-bold">
                            ✓ SELECTED
                          </span>
                        </div>
                      ) : (
                        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs md:text-sm font-medium">
                          Click to Select
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Draw */}
                  <button
                    onClick={() => handlePrediction(game.id, 'draw')}
                    className={`p-4 md:p-6 rounded-xl border-3 transition-all transform hover:scale-105 ${
                      userPrediction === 'draw'
                        ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                        : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">🤝</div>
                      <h4 className="font-bold text-sm md:text-lg text-gray-900 mb-2">DRAW</h4>
                      <p className="text-sm text-gray-600 mb-3">TIE GAME</p>
                      {userPrediction === 'draw' ? (
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs md:text-sm font-bold">
                            ✓ SELECTED
                          </span>
                        </div>
                      ) : (
                        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs md:text-sm font-medium">
                          Click to Select
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Away Team */}
                  <button
                    onClick={() => handlePrediction(game.id, 'away')}
                    className={`p-4 md:p-6 rounded-xl border-3 transition-all transform hover:scale-105 ${
                      userPrediction === 'away'
                        ? 'border-red-500 bg-red-50 shadow-lg'
                        : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">✈️</div>
                      <h4 className="font-bold text-sm md:text-lg text-gray-900 mb-2">{game.awayTeam}</h4>
                      <p className="text-sm text-gray-600 mb-3">AWAY TEAM</p>
                      {userPrediction === 'away' ? (
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs md:text-sm font-bold">
                            ✓ SELECTED
                          </span>
                        </div>
                      ) : (
                        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs md:text-sm font-medium">
                          Click to Select
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                {/* Selection Status */}
                <div className="mt-4 text-center">
                  {userPrediction ? (
                    <p className="text-green-600 font-medium">
                      ✅ You predicted: <span className="font-bold">
                        {userPrediction === 'home' ? game.homeTeam : 
                         userPrediction === 'away' ? game.awayTeam : 'Draw'}
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-500">Click on a team or draw to make your prediction</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {Object.keys(selectedPredictions).length > 0 && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-green-800 mb-3 text-xl">
                🎯 Ready to Submit Your Predictions!
              </h3>
              <p className="text-green-700 text-lg mb-4">
                You've made {Object.keys(selectedPredictions).length} prediction(s). 
                Submit now to compete for the <span className="font-bold">25,000 Flixbits</span> prize!
              </p>
              
              {/* Summary of Predictions */}
              <div className="space-y-2 mb-4">
                {Object.entries(selectedPredictions).map(([gameId, prediction]) => {
                  const game = availableGames.find(g => g.id === gameId);
                  if (!game) return null;
                  return (
                    <div key={gameId} className="text-sm text-green-600 bg-white rounded-lg p-2">
                      <span className="font-medium">{game.homeTeam} vs {game.awayTeam}</span>: 
                      <span className="font-bold ml-2 rtl:ml-0 rtl:mr-2">
                        {prediction === 'home' ? `🏠 ${game.homeTeam}` : 
                         prediction === 'away' ? `✈️ ${game.awayTeam}` : '🤝 Draw'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={submitPredictions}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 md:px-12 py-3 md:py-4 rounded-xl font-bold text-lg md:text-xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-xl"
            >
              <span className="hidden sm:inline">🏆 SUBMIT MY PREDICTIONS ({Object.keys(selectedPredictions).length} games)</span>
              <span className="sm:hidden">🏆 SUBMIT ({Object.keys(selectedPredictions).length})</span>
            </button>
            <p className="text-gray-600 mt-3 text-sm md:text-lg">
              💰 Earn <span className="font-bold">+{Object.keys(selectedPredictions).length * 50} Flixbits</span> for participation + huge bonus for correct predictions!
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">📋 How to Play</h3>
        <div className="space-y-3 text-blue-700">
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <p>Look at each game with team names, date, and time</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
            <p>Click on the team box you think will win (or Draw for tie)</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <p>See the green checkmark ✓ appear when you select</p>
          </div>
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
            <p>Submit your predictions to earn Flixbits and compete for prizes!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePredictions;