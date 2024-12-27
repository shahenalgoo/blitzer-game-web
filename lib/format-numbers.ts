/**
 * FORMAT TIME
 * A helper function to format time to a readable format for the leaderboard.
 *
 */

export const formatTime = (timeInSeconds: number): string => {
	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = Math.floor(timeInSeconds % 60);
	const milliseconds = Math.round((timeInSeconds % 1) * 100);
	const pad = (num: number, length: number = 2): string => num.toString().padStart(length, '0');

	// return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds, 2)}`;
	return `${pad(minutes)}m ${pad(seconds)}s`;
};