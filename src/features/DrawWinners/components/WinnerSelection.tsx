import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Trophy, 
  Users, 
  Gift, 
  Download, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Send,
  Eye,
  Shuffle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useWinnerSelection } from '../hooks/useWinnerSelection';
import { DrawEvent, DrawWinner } from '../types';
import { getPrizeTypeIcon, exportWinners } from '../utils/helpers';

interface WinnerSelectionProps {
  event: DrawEvent;
  onWinnersSelected: (winners: DrawWinner[]) => void;
}

const WinnerSelection: React.FC<WinnerSelectionProps> = ({ event, onWinnersSelected }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRTL = i18n.language === 'ar';
  
  const { isDrawing, drawResults, conductDraw, claimPrize, resetDraw } = useWinnerSelection();
  const [showDrawAnimation, setShowDrawAnimation] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<DrawWinner | null>(null);
  const [showWinnerDetails, setShowWinnerDetails] = useState(false);
  const [claimCode, setClaimCode] = useState('');

  const eligibleAttendees = event.attendees.filter(attendee => 
    attendee.isEligibleForDraw && attendee.verificationStatus === 'verified'
  );

  const totalPrizes = event.prizes.reduce((sum, prize) => sum + prize.quantity, 0);

  const handleConductDraw = async () => {
    if (eligibleAttendees.length === 0) {
      alert('No eligible attendees for the draw');
      return;
    }

    if (event.prizes.length === 0) {
      alert('No prizes configured for this event');
      return;
    }

    setShowDrawAnimation(true);
    
    try {
      const winners = await conductDraw(event);
      onWinnersSelected(winners);
      
      // Send notifications to winners (in real app)
      alert(`🎉 Draw completed! ${winners.length} winners selected and notified.`);
    } catch (error) {
      alert('Error conducting draw: ' + error.message);
    } finally {
      setShowDrawAnimation(false);
    }
  };

  const handleClaimPrize = async () => {
    if (!selectedWinner || !claimCode) return;

    const success = await claimPrize(selectedWinner.id, claimCode);
    if (success) {
      alert('Prize claimed successfully!');
      setShowWinnerDetails(false);
      setClaimCode('');
    } else {
      alert('Invalid claim code or prize has expired');
    }
  };

  const copyClaimCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Claim code copied to clipboard!');
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'claimed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🎲 Winner Selection</h1>
        <p className="text-purple-100">Conduct fair and transparent prize draws for your event</p>
      </div>

      {/* Event Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{eligibleAttendees.length}</p>
            <p className="text-sm text-blue-800">Eligible Attendees</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Gift className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-purple-600">{event.prizes.length}</p>
            <p className="text-sm text-purple-800">Prize Categories</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{totalPrizes}</p>
            <p className="text-sm text-green-800">Total Winners</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-orange-600">{drawResults.length}</p>
            <p className="text-sm text-orange-800">Selected Winners</p>
          </div>
        </div>
      </div>

      {/* Prizes Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Prize Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.prizes.map((prize) => (
            <div key={prize.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{getPrizeTypeIcon(prize.type)}</span>
                <span className="text-sm text-gray-500">{prize.quantity} winner{prize.quantity > 1 ? 's' : ''}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{prize.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{prize.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-600">
                  {prize.value} {prize.type === 'flixbits' ? 'FB' : 'value'}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  prize.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {prize.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Draw Controls */}
      {drawResults.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Conduct Draw?</h3>
            
            {eligibleAttendees.length === 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h4 className="font-bold text-red-800 mb-2">No Eligible Attendees</h4>
                <p className="text-red-600">There are no verified attendees eligible for the draw.</p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h4 className="font-bold text-green-800 mb-2">Ready for Draw!</h4>
                <p className="text-green-600">
                  {eligibleAttendees.length} verified attendees are eligible for {totalPrizes} prizes
                </p>
              </div>
            )}
            
            <button
              onClick={handleConductDraw}
              disabled={isDrawing || eligibleAttendees.length === 0 || event.prizes.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 rtl:space-x-reverse mx-auto"
            >
              {isDrawing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Conducting Draw...</span>
                </>
              ) : (
                <>
                  <Shuffle className="w-6 h-6" />
                  <span>🎲 Conduct Prize Draw</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Draw Animation */}
      {showDrawAnimation && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Shuffle className="w-16 h-16 text-white animate-spin" />
              </div>
              
              {/* Floating prize icons */}
              <div className="absolute inset-0 flex items-center justify-center">
                {event.prizes.map((prize, index) => (
                  <div
                    key={prize.id}
                    className="absolute text-4xl animate-bounce"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                      transform: `rotate(${index * 45}deg) translateY(-80px)`
                    }}
                  >
                    {getPrizeTypeIcon(prize.type)}
                  </div>
                ))}
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🎲 Drawing Winners...</h3>
            <p className="text-gray-600 mb-4">Using cryptographically secure random selection</p>
            
            <div className="space-y-2 text-sm text-gray-500">
              <p>✅ Verifying eligible attendees</p>
              <p>✅ Shuffling participant pool</p>
              <p>✅ Selecting winners randomly</p>
              <p>⏳ Generating claim codes...</p>
            </div>
          </div>
        </div>
      )}

      {/* Winners Results */}
      {drawResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">🏆 Draw Results</h3>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={() => exportWinners(drawResults, event.title)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Download className="w-4 h-4" />
                <span>Export Winners</span>
              </button>
              <button
                onClick={resetDraw}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Reset Draw
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {drawResults.map((winner) => (
              <div key={winner.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="text-3xl">{getPrizeTypeIcon(winner.prizeType)}</div>
                    <div>
                      <h4 className="font-bold text-gray-900">{winner.userName}</h4>
                      <p className="text-gray-600 text-sm">{winner.prizeTitle}</p>
                      <p className="text-purple-600 font-semibold">
                        {winner.prizeValue} {winner.prizeType === 'flixbits' ? 'Flixbits' : 'value'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right rtl:text-left">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClaimStatusColor(winner.claimStatus)}`}>
                      {winner.claimStatus}
                    </span>
                    <div className="mt-2 space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          setSelectedWinner(winner);
                          setShowWinnerDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Eye className="w-4 h-4 inline mr-1 rtl:mr-0 rtl:ml-1" />
                        View
                      </button>
                      <button
                        onClick={() => copyClaimCode(winner.claimCode)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        <Copy className="w-4 h-4 inline mr-1 rtl:mr-0 rtl:ml-1" />
                        Copy Code
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Claim Code: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{winner.claimCode}</code></span>
                    <span>Deadline: {winner.claimDeadline.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">📧 Next Steps</h4>
            <div className="space-y-1 text-blue-700 text-sm">
              <p>• Winners have been automatically notified via email and app notification</p>
              <p>• Claim codes are valid for 7 days from selection date</p>
              <p>• Physical prizes can be collected from specified locations</p>
              <p>• Flixbits prizes are automatically added to winner wallets</p>
            </div>
          </div>
        </div>
      )}

      {/* Winner Details Modal */}
      {showWinnerDetails && selectedWinner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Winner Details</h2>
                <button
                  onClick={() => setShowWinnerDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{getPrizeTypeIcon(selectedWinner.prizeType)}</div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedWinner.prizeTitle}</h3>
                  <p className="text-purple-600 font-semibold">
                    {selectedWinner.prizeValue} {selectedWinner.prizeType === 'flixbits' ? 'Flixbits' : 'value'}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Winner</label>
                    <p className="text-gray-900">{selectedWinner.userName}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Claim Code</label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <code className="bg-gray-100 px-3 py-2 rounded font-mono flex-1">{selectedWinner.claimCode}</code>
                      <button
                        onClick={() => copyClaimCode(selectedWinner.claimCode)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClaimStatusColor(selectedWinner.claimStatus)}`}>
                      {selectedWinner.claimStatus}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Claim Deadline</label>
                    <p className="text-gray-900">{selectedWinner.claimDeadline.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Selected At</label>
                    <p className="text-gray-900">{selectedWinner.selectedAt.toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedWinner.claimStatus === 'pending' && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Test Claim Process</h4>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <input
                        type="text"
                        value={claimCode}
                        onChange={(e) => setClaimCode(e.target.value)}
                        placeholder="Enter claim code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleClaimPrize}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-6">
                <button
                  onClick={() => setShowWinnerDetails(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnerSelection;