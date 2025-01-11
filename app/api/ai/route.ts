import { NextResponse } from "next/server";
import polly from "@/lib/aws";
import { SynthesizeSpeechCommand } from '@aws-sdk/client-polly';

export async function POST(request: Request) {
	try {
		const { text } = await request.json();

		const voiceLine = `
		<speak>
<amazon:effect  vocal-tract-length="-20%">
<prosody pitch="-60%" rate="60%">${text}

</prosody>
</amazon:effect>
</speak>
		`

		const command = new SynthesizeSpeechCommand({
			Text: voiceLine,
			TextType: "ssml",
			VoiceId: "Matthew",
			Engine: "standard",
			OutputFormat: 'mp3',
		});

		const response = await polly.send(command);

		// Convert AudioStream to Buffer
		const audioBuffer = await response.AudioStream?.transformToByteArray();

		if (!audioBuffer) {
			throw new Error('Failed to generate audio');
		}

		// Return audio as response
		return new NextResponse(audioBuffer, {
			headers: {
				'Content-Type': 'audio/mpeg',
				'Content-Length': audioBuffer.length.toString(),
			},
		});
	} catch (error) {
		console.error('Error generating speech:', error);
		return NextResponse.json(
			{ error: 'Failed to generate speech' },
			{ status: 500 }
		);
	}
}