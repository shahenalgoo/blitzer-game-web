"use client";

import { base64ToBlob } from "@/lib/base64-to-blob";
import { useApplicationStore } from "@/store/use-application-store";
import { FC, useCallback, useEffect, useState } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { client } from "../amplify/amplify-client-config";
import { fetchUserAttributes } from "@aws-amplify/auth";
import { uploadData } from 'aws-amplify/storage';
import { compressImage } from "@/lib/compress-image";

interface LevelUploaderProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	takeScreenshot: (dataType?: string, quality?: number) => string | undefined
}

const LevelUploader: FC<LevelUploaderProps> = ({
	addEventListener,
	removeEventListener,
	takeScreenshot
}) => {

	const { gameModeActive, generatedLevelData } = useApplicationStore();
	const [username, setUsername] = useState<string | undefined>(undefined);


	useEffect(() => {
		fetchUserAttributes().then((user) => {
			setUsername(user.preferred_username);
		}).catch((error) => {
			console.log(error);
		});
	}, []);


	const handleExecuteFromEvent = useCallback(() => {
		if (gameModeActive === "normal") handleUploadLevel();
	}, [handleUploadLevel]);

	useEffect(() => {
		addEventListener("TakeScreenshot", handleExecuteFromEvent);
		return () => removeEventListener("TakeScreenshot", handleExecuteFromEvent);
	}, [addEventListener, removeEventListener, handleExecuteFromEvent]);


	async function handleUploadLevel() {
		const dataUrl = takeScreenshot("image/jpg", 1);

		if (username && dataUrl) {
			let blob = base64ToBlob(dataUrl, "image/jpg");
			const path = `ai-levels/${username}-${new Date().getTime()}.jpg`;
			const fallbackLevel = [[0, 0, 0, 0, 2, 1, 4, 1, 0, 0, 0, 0, 2, 1, 5, 1, 0, 0, 0, 0], [0, 2, 4, 1, 3, 0, 0, 2, 1, 0, 0, 2, 0, 0, 0, 2, 1, 3, 2, 0], [0, 1, 0, 0, 1, 0, 0, 0, 5, 1, 4, 1, 0, 0, 0, 0, 0, 1, 7, 0], [0, 2, 1, 0, 2, 1, 3, 0, 0, 2, 0, 5, 1, 2, 1, 4, 0, 2, 0, 0], [1, 6, 2, 6, 1, 2, 1, 4, 1, 6, 2, 1, 2, 6, 1, 3, 1, 5, 2, 1], [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0], [0, 2, 1, 4, 1, 3, 1, 5, 1, 2, 1, 3, 0, 0, 0, 2, 1, 4, 2, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 8, 0], [0, 0, 0, 0, 0, 2, 1, 5, 1, 0, 0, 0, 0, 2, 1, 3, 1, 2, 0, 0]];

			try {
				blob = await compressImage(blob, 1024, 0.8);
				await uploadData({
					path,
					data: blob,
				}).result.then((image) => {
					console.log(image.path);
					client.models.AiLevel.create({
						grid: JSON.stringify(generatedLevelData || fallbackLevel),
						generatedBy: username || "Unknown",
						cover: image.path
					});
				});
			} catch (error) {
				console.log(error);
			}

		}
	}

	return (
		<></>
	)
}

export default LevelUploader;