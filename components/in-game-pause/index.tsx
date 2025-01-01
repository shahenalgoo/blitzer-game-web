"use client";

import { useApplicationStore } from "@/store/use-application-store";
import { FC, useCallback, useEffect, useState } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import Dialog from "../ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface InGamePauseProps {
	addEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	removeEventListener: (eventName: string, callback: (...parameters: ReactUnityEventParameter[]) => ReactUnityEventParameter) => void;
	sendMessage: (gameObjectName: string, methodName: string, parameter?: ReactUnityEventParameter) => void;
}

enum ConfirmationAction {
	None = "none",
	Restart = "restart",
	Exit = "exit"
}



const InGamePause: FC<InGamePauseProps> = ({
	addEventListener,
	removeEventListener,
	sendMessage
}) => {

	const { inGamePauseActive, setInGamePauseActive, gameModeActive } = useApplicationStore();
	const [sfx, setSfx] = useState(true);
	const [music, setMusic] = useState(true);
	const [confirmationActive, setConfirmationActive] = useState(false);
	const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction>(ConfirmationAction.None);


	const handleSetPauseMenu = useCallback((sfxMute: any, musicMute: any) => {
		setInGamePauseActive(true);
		sfxMute === 0 ? setSfx(true) : setSfx(false);
		musicMute === 0 ? setMusic(true) : setMusic(false);
	}, []);

	useEffect(() => {
		addEventListener("ActivatePauseMenu", handleSetPauseMenu);
		return () => removeEventListener("ActivatePauseMenu", handleSetPauseMenu);
	}, [addEventListener, removeEventListener, handleSetPauseMenu]);



	const handleUnpauseMenu = useCallback(() => {
		setInGamePauseActive(false);
	}, []);

	useEffect(() => {
		addEventListener("DeactivatePauseMenu", handleUnpauseMenu);
		return () => removeEventListener("DeactivatePauseMenu", handleUnpauseMenu);
	}, [addEventListener, removeEventListener, handleUnpauseMenu]);


	function handleClosePauseMenu() {
		setInGamePauseActive(false);
		sendMessage("UICanvas", "TogglePauseGame")
	}

	function handleMuteSFX() {
		setSfx(!sfx);
		sendMessage("UICanvas", "ToggleSFXFromReact");
	}

	function handleMuteMusic() {
		setMusic(!music);
		sendMessage("UICanvas", "ToggleMusicFromReact");
	}




	// CONFIRMATION
	// Restart or Exit confirmation handling
	function handleGameAction(action: ConfirmationAction, isConfirmation: boolean = false) {
		if (!isConfirmation) {
			setConfirmationActive(true);
			setConfirmationAction(action);
			return;
		}

		if (action === ConfirmationAction.None) {
			setConfirmationActive(false);
			setConfirmationAction(ConfirmationAction.None);
			return;
		}

		const actions = {
			[ConfirmationAction.Restart]: () => sendMessage("UICanvas", "RestartLevel"),
			[ConfirmationAction.Exit]: () => sendMessage("UICanvas", "ExitToMainMenu")
		};

		setInGamePauseActive(false);
		actions[action]?.();

		setTimeout(() => {
			setConfirmationActive(false);
			setConfirmationAction(ConfirmationAction.None);
		}, 1000);
	}


	return (
		<Dialog
			open={inGamePauseActive}
			onOpenChange={() => { }}
			className="overflow-hidden max-w-xs"
		>
			<div className="relative z-10 flex flex-col items-center justify-center">

				<div className="mb-6 text-center">
					{!confirmationActive
						? <h2 className="text-3xl font-orbitron tracking-wide">Paused</h2>
						: <h2 className="text-2xl font-orbitron tracking-wide">Are you sure?</h2>
					}
					<span className="text-sm text-muted-foreground">
						{!confirmationActive
							? <>{gameModeActive === "normal" ? "Normal Mode" : gameModeActive === "bossFight" ? "Boss Fight" : "AI Generated Level"}</>
							: <>{confirmationAction === "restart" ? "Restart Game" : "Exit to main menu"}</>
						}
					</span>
				</div>

				{!confirmationActive &&
					<>
						<div className="space-y-3 outline-none">
							<Button onClick={handleClosePauseMenu} variant={"secondary"} className="w-full shadow-none" tabIndex={-1}>Resume</Button>
							<Button onClick={() => handleGameAction(ConfirmationAction.Restart)} variant={"secondary"} className="w-full" tabIndex={-1}>Restart</Button>
							<Button onClick={() => handleGameAction(ConfirmationAction.Exit)} variant={"secondary"} className="w-full" tabIndex={-1}>Exit to Main Menu</Button>
						</div>


						<div className="my-6 w-10 h-[1px] mx-auto bg-white/10"></div>

						<div className="relative flex items-center border rounded-2xl px-2">
							<div className="flex items-center">
								<Switch id="sfx" checked={sfx} onCheckedChange={handleMuteSFX} tabIndex={-1} />
								<Label htmlFor="sfx" className="cursor-pointer pl-2 py-2">SFX</Label>
							</div>

							<div className="mx-6 w-[1px] h-4 bg-white/10" />

							<div className="flex items-center">
								<Switch id="music" checked={music} onCheckedChange={handleMuteMusic} tabIndex={-1} />
								<Label htmlFor="music" className="cursor-pointer pl-2 py-2">Music</Label>
							</div>
						</div>
					</>
				}

				{confirmationActive &&
					<div className="w-full flex items-center space-x-2">
						<Button onClick={() => handleGameAction(ConfirmationAction.None, true)} variant={"outline"} className="!flex-1 shadow-none" tabIndex={-1}>No</Button>
						<Button
							onClick={() => {
								if (confirmationAction === ConfirmationAction.Restart) handleGameAction(ConfirmationAction.Restart, true);
								else if (confirmationAction === ConfirmationAction.Exit) handleGameAction(ConfirmationAction.Exit, true);
							}}
							variant={"orange"}
							className="!flex-1 shadow-none"
							tabIndex={-1}
						>
							Yes
						</Button>
					</div>
				}

			</div>
		</Dialog>
	);
}

export default InGamePause;