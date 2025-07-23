import { useState, useCallback } from 'react';
import { DrawEvent, DrawWinner, DrawPrize } from '../types';
import { generateClaimCode } from '../utils/helpers';

export const useWinnerSelection = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawResults, setDrawResults] = useState<DrawWinner[]>([]);

  const conductDraw = useCallback(async (event: DrawEvent): Promise<DrawWinner[]> => {
    setIsDrawing(true);

    try {
      // Get eligible attendees
      const eligibleAttendees = event.attendees.filter(attendee => 
        attendee.isEligibleForDraw && attendee.verificationStatus === 'verified'
      );

      if (eligibleAttendees.length === 0) {
        throw new Error('No eligible attendees for the draw');
      }

      const winners: DrawWinner[] = [];

      // Process each prize
      for (const prize of event.prizes) {
        if (!prize.isActive) continue;

        // Select winners for this prize
        const availableAttendees = event.drawSettings.allowMultipleWins 
          ? eligibleAttendees 
          : eligibleAttendees.filter(attendee => 
              !winners.some(winner => winner.userId === attendee.userId)
            );

        if (availableAttendees.length === 0) continue;

        // Randomly select winners
        const selectedWinners = [];
        const attendeesToSelect = Math.min(prize.quantity, availableAttendees.length);

        for (let i = 0; i < attendeesToSelect; i++) {
          const randomIndex = Math.floor(Math.random() * availableAttendees.length);
          const selectedAttendee = availableAttendees.splice(randomIndex, 1)[0];

          const winner: DrawWinner = {
            id: `winner_${Date.now()}_${i}`,
            attendeeId: selectedAttendee.id,
            userId: selectedAttendee.userId,
            userName: selectedAttendee.userName,
            prizeId: prize.id,
            prizeTitle: prize.title,
            prizeType: prize.type,
            prizeValue: prize.value,
            selectedAt: new Date(),
            claimStatus: 'pending',
            claimCode: generateClaimCode(),
            claimDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            deliveryInfo: {
              method: prize.type === 'flixbits' ? 'digital' : 'pickup',
              status: 'pending'
            }
          };

          selectedWinners.push(winner);
          winners.push(winner);
        }
      }

      // Simulate draw animation delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      setDrawResults(winners);
      return winners;

    } catch (error) {
      console.error('Error conducting draw:', error);
      throw error;
    } finally {
      setIsDrawing(false);
    }
  }, []);

  const claimPrize = useCallback(async (winnerId: string, claimCode: string): Promise<boolean> => {
    try {
      // In real app, this would verify claim code with backend
      const winner = drawResults.find(w => w.id === winnerId);
      if (!winner || winner.claimCode !== claimCode) {
        return false;
      }

      if (new Date() > winner.claimDeadline) {
        return false;
      }

      // Update winner status
      setDrawResults(prev => 
        prev.map(w => 
          w.id === winnerId 
            ? { ...w, claimStatus: 'claimed', claimedAt: new Date() }
            : w
        )
      );

      return true;
    } catch (error) {
      console.error('Error claiming prize:', error);
      return false;
    }
  }, [drawResults]);

  const resetDraw = () => {
    setDrawResults([]);
    setIsDrawing(false);
  };

  return {
    isDrawing,
    drawResults,
    conductDraw,
    claimPrize,
    resetDraw
  };
};