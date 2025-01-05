"use client";

import { FC } from "react";
import Dialog from "../ui/dialog";
import { useApplicationStore } from "@/store/use-application-store";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { Separator } from "../ui/separator";

interface CreditsProps {

}

const Credits: FC<CreditsProps> = () => {

	const { creditsDialogActive, setCreditsDialogActive } = useApplicationStore();

	return (
		<Dialog
			open={creditsDialogActive}
			onOpenChange={setCreditsDialogActive}
			className="overflow-hidden max-w-md"
		>
			<div className="relative z-10">
				<div className="mb-8 flex items-center">
					<Button variant={"outline"} size={"icon"} className="shrink-0 mr-4" onClick={() => setCreditsDialogActive(false)}>
						<ChevronLeft />
					</Button>
					<h3 className="font-orbitron text-2xl tracking-wider">Credits</h3>
				</div>

				<div className="space-y-8">
					<div>
						<h3 className="text-lg">Deeshay Algoo</h3>
						<p className="text-sm text-muted-foreground">Game Designer, Programmer, VFX.</p>
					</div>
					<div>
						<h3 className="text-lg">Shahen Algoo</h3>
						<p className="text-sm text-muted-foreground">Full-Stack Developer & Artist</p>
					</div>

					<Separator />

					<div>
						<h3 className="text-lg">External Assets</h3>
						<p className="text-sm text-muted-foreground">Dustyroom - Toon Shading</p>
						<p className="text-sm text-muted-foreground">Sidearm Studios - Sound/FX</p>
						<p className="text-sm text-muted-foreground">Seaside Studios - VFX Creator Toolkit</p>
					</div>
				</div>

			</div>
		</Dialog>
	)
}

export default Credits;