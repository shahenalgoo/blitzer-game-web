"use client";

import { useCallback, useEffect, useRef } from "react";
import { useApplicationStore } from "@/store/use-application-store";

import UnityLoader from "@/components/unity/unity-loader";
import { Unity, useUnityContext } from "react-unity-webgl";
import MainMenu from "@/components/main-menu";
import MainMenuButton from "@/components/main-menu/main-menu-btn";
import { useRefStore } from "@/store/use-ref-store";
import LevelSelector from "@/components/level-selector";
import { useAiLevelStore } from "@/store/use-ai-level-store";
import LevelGenerator from "@/components/level-generator";
import SubmitToLeaderboard from "@/components/submit-to-leaderboard";

export default function App() {

	const containerRef = useRef<HTMLDivElement>(null);
	const { setContainerRef } = useRefStore();

	const {
		setIsUnityLoaded,
		setIsMainMenuActive,
		setSubmitDialogActive,

		setIsLevelSelectorActive,
		setIsLevelGeneratorActive
	} = useApplicationStore();
	const { generatedLevel, triggerAiLevelMode } = useAiLevelStore();


	// UNITY CONTEXT
	// Used for loading and interacting unity
	const {
		unityProvider,
		isLoaded,
		loadingProgression,
		addEventListener,
		removeEventListener,
		sendMessage
	} = useUnityContext({
		loaderUrl: "/game/Build/blitzer.loader.js",
		dataUrl: "/game/Build/blitzer.data",
		frameworkUrl: "/game/Build/blitzer.framework.js",
		streamingAssetsUrl: "/game/StreamingAssets",
		codeUrl: "/game/Build/blitzer.wasm",
		companyName: "AWS Hackathon",
		productName: "Blitzer",
		productVersion: "1"
	});



	// SET STORE WHEN UNITY IS LOADED
	//
	useEffect(() => {
		setIsUnityLoaded(isLoaded)
	}, [isLoaded]);



	// CONTAINER REFERENCE
	// Used for fullscreen compatibility
	useEffect(() => {
		setContainerRef(containerRef)
	}, [setContainerRef]);



	// HANDLE MAIN MENU STATE
	// Receives event from Unity to activate the main menu when the game is loaded
	const handleSetMainMain = useCallback(() => {
		setIsMainMenuActive(true)
	}, []);

	useEffect(() => {
		addEventListener("ActivateMainMenu", handleSetMainMain);
		return () => removeEventListener("ActivateMainMenu", handleSetMainMain);
	}, [addEventListener, removeEventListener, handleSetMainMain]);



	// START A STANDARD GAME
	// Sends event to Unity to start a standard game
	function handleStartNormalMode() {
		setIsMainMenuActive(false);
		sendMessage("MainMenuManager", "StartNormalMode");
	}

	const handleStartBossFightMode = () => {
		setIsMainMenuActive(false);
		sendMessage("MainMenuManager", "StartBossFight");
	}

	return (
		<div className="w-full h-full" ref={containerRef}>

			<UnityLoader isLoaded={isLoaded} loadingProgression={loadingProgression} />
			<Unity id="game" unityProvider={unityProvider} className="fixed top-0 left-0 z-0 aspect-video w-full h-screen" />

			<MainMenu>
				<MainMenuButton onClick={handleStartNormalMode} title="Standard" description="Play 3 levels and beat the final boss." />
				<MainMenuButton onClick={() => setIsLevelGeneratorActive(true)} title="AI Levels" description="Play a level generated by AWS Bedrock." />
				{/* <MainMenuButton onClick={() => setIsLevelSelectorActive(true)} title="AI Levels" description="Play a level generated by AWS Bedrock." /> */}
				<MainMenuButton onClick={() => setSubmitDialogActive(true)} title="SubmitScore" description="Play a level generated by AWS Bedrock." />
				<MainMenuButton onClick={handleStartBossFightMode} title="Boss Fight" description="Fight the boss in the final level." />
			</MainMenu>

			<LevelSelector />
			<LevelGenerator sendMessage={sendMessage}>Test</LevelGenerator>
			<SubmitToLeaderboard addEventListener={addEventListener} removeEventListener={removeEventListener} />

		</div>
	);
}