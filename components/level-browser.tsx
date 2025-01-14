/**
 * LEVEL BROWSER
 * Fetches levels from database and displays them in a scrollable list
 * 
 */

"use client";

import { FC, useEffect } from "react";
import Image from "next/image";
import { useApplicationStore } from "@/store/use-application-store";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { client } from "./amplify/amplify-client-config";
import { getUrl } from "aws-amplify/storage";
import Dialog from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useLevelsStore } from "@/store/use-level-store";


interface LevelBrowserProps {
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}


const LevelBrowser: FC<LevelBrowserProps> = ({ sendMessage }) => {


	// Global Store
	const { levelBrowserActive, setLevelBrowserActive, setGameModeActive, setCustomGameLaunchedFrom, setMainMenuActive } = useApplicationStore();
	const { levels, setLevels } = useLevelsStore();


	// Fetch Levels
	useEffect(() => {
		console.log("🔃 Fetching levels");

		const sub = client.models.AiLevel.observeQuery().subscribe({
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

		return () => sub.unsubscribe();
	}, []);


	// Start playing a level
	const handleStartAILevelMode = (grid: string) => {
		if (!grid) return;
		setGameModeActive('custom');
		setCustomGameLaunchedFrom('level-browser');
		setMainMenuActive(false);
		setLevelBrowserActive(false);
		sendMessage("MainMenuManager", "StartAILevelMode", `{grid: ${grid}}`);
	}


	// Format date
	const formatDate = (isoString: string) => {
		const date = new Date(isoString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	};


	// Function used during development to deleve a level
	// async function deleteLevel(id: string, path: string) {
	// 	await client.models.AiLevel.delete({ id });
	// 	await remove({ path }).catch((error) => {
	// 		console.log(error);
	// 	});
	// }


	return (
		<Dialog
			open={levelBrowserActive}
			onOpenChange={setLevelBrowserActive}
			className="max-w-7xl min-h-[calc(100vh_-_10rem)]"
		>
			<div className="relative z-10 h-full outline-none">

				<div className="mb-8 flex items-center">
					<Button variant={"outline"} size={"icon"} className="shrink-0 mr-4" onClick={() => setLevelBrowserActive(false)}>
						<ChevronLeft />
					</Button>
					<h3 className="font-orbitron text-2xl tracking-wider">Level Browser</h3>
					<p className="ml-auto text-sm font-light text-muted-foreground">Play AI levels generated by the community.</p>
				</div>

				<ScrollArea className="h-[calc(100vh_-_18rem)] px-4">
					<div className="grid grid-cols-3 gap-4 w-full">
						{levels && levels.map((level, index) => (
							<button
								key={level.id}
								onClick={() => level.grid ? handleStartAILevelMode(level.grid) : null}
								className="group p-2 outline-none transition-colors rounded-2xl bg-white/5 hover:bg-primary/5 border hover:border-primary"
							>
								<div className="relative overflow-hidden transition-colors rounded-xl w-full h-60 flex justify-center items-center bg-[#13001c]">
									{level.coverImage &&
										<>
											<h4 className="absolute top-3 left-0 z-20 px-2 py-1 rounded-r-full bg-secondary text-xs">By {level.generatedBy}</h4>
											<h4 className="absolute top-10 left-0 z-20 px-2 py-1 rounded-r-full bg-secondary text-xs">{formatDate(level.createdAt)}</h4>
											<Image
												src={level.coverImage}
												width={600}
												height={338}
												priority
												quality={100}
												alt="level cover"
												className="absolute top-0 left-0 z-10 w-full h-full object-cover"
											/>
										</>
									}
									<LoaderCircle className="relative z-0 animate-spin" />
								</div>
								{/* <div onClick={() => deleteLevel(level.id, level.cover || "")}>del</div> */}
							</button>
						))}
					</div>
				</ScrollArea>

			</div>
		</Dialog>
	)
}

export default LevelBrowser;