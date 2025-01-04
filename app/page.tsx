"use client";

import { useEffect, useRef } from "react";
import { useRefStore } from "@/store/use-ref-store";

import { Unity, useUnityContext } from "react-unity-webgl";

import UnityLoader from "@/components/unity/unity-loader";
import MainMenu from "@/components/main-menu/index";
import LevelGenerator from "@/components/level-generator";
import SubmitToLeaderboard from "@/components/leaderboard/submit";
import Leaderboard from "@/components/leaderboard";
import LevelBrowser from "@/components/level-browser";
import LevelUploader from "@/components/level-generator/level-uploader";
import { client } from "@/components/amplify/amplify-client-config";
import { useDataStore } from "@/store/use-data-store";
import { getUrl } from "aws-amplify/storage";
import MenuPause from "@/components/menu-pause";
import MenuDeath from "@/components/menu-death";
import Debug from "@/components/debug";

export default function App() {

	const containerRef = useRef<HTMLDivElement>(null);
	const { setContainerRef } = useRefStore();
	const { setLevels } = useDataStore();


	// UNITY CONTEXT
	// Used for loading and interacting unity
	const gameName = "b8";
	const {
		unityProvider,
		isLoaded,
		loadingProgression,
		addEventListener,
		removeEventListener,
		sendMessage,
		takeScreenshot
	} = useUnityContext({
		loaderUrl: `/game/Build/${gameName}.loader.js`,
		dataUrl: `/game/Build/${gameName}.data`,
		frameworkUrl: `/game/Build/${gameName}.framework.js`,
		codeUrl: `/game/Build/${gameName}.wasm`,
		streamingAssetsUrl: "/game/StreamingAssets",
		companyName: "AWS Hackathon",
		productName: "Blitzer",
		productVersion: "1",
		webglContextAttributes: {
			preserveDrawingBuffer: true,
		}
	});



	// CONTAINER REFERENCE
	// Used for fullscreen compatibility
	useEffect(() => {
		setContainerRef(containerRef)
	}, [setContainerRef]);



	// Prefetch data for better user experience
	async function fetchLevels() {
		client.models.AiLevel.observeQuery().subscribe({
			next: async (data) => {
				const levelsWithCovers = await Promise.all(
					data.items
						// Sort in descending order (newest first)
						.sort((a, b) => {
							return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
						})
						// Map to add cover image URL from S3
						.map(async (level) => {
							if (level.cover) {
								const coverUrl = await getUrl({ path: level.cover });
								return { ...level, coverImage: coverUrl.url.href };
							}
							return level;
						})
				)
				setLevels(levelsWithCovers);
			},
		});
	}

	useEffect(() => {
		console.log("⚠️ fetching levels")
		fetchLevels();
	}, []);



	return (
		<main className="relative z-10 w-full h-screen flex justify-center items-center" ref={containerRef}>

			<UnityLoader
				isLoaded={isLoaded}
				loadingProgression={loadingProgression}
			/>

			<Unity
				id="game"
				unityProvider={unityProvider}
				className="fixed top-0 left-0 z-0 aspect-video w-full h-screen"
			/>

			<MainMenu
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>

			<LevelGenerator
				sendMessage={sendMessage}
			/>

			<LevelBrowser
				sendMessage={sendMessage}
			/>

			<LevelUploader
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				takeScreenshot={takeScreenshot}
			/>

			<Leaderboard />
			<SubmitToLeaderboard
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>


			<MenuPause
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>

			<MenuDeath
				addEventListener={addEventListener}
				removeEventListener={removeEventListener}
				sendMessage={sendMessage}
			/>

			{/* <Debug /> */}

		</main>
	);
}