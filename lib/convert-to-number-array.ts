/**
 * CONVERT AI GENERATED LEVEL TO NUMBER ARRAY
 * 
 */
export const convertToNumberArray = (input: string): number[][] => {
	try {
		// Use JSON.parse to convert the string to a number[][]
		const parsedData = JSON.parse(input);

		// Ensure the parsed data is a valid number[][]
		if (!Array.isArray(parsedData) || !parsedData.every(row => Array.isArray(row) && row.every(cell => typeof cell === "number"))) {
			throw new Error("Invalid data format");
		}

		return parsedData;
	} catch (error) {
		console.error("Error parsing input:", error);
		throw new Error("Failed to convert input to number[][]");
	}
};