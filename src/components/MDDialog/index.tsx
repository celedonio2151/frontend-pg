import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

interface MDScrollDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	title: React.ReactNode;
	closeButton?: boolean;
	children: React.ReactNode;
}

export default function MDScrollDialog({
	open,
	setOpen,
	title,
	closeButton = true,
	children,
}: MDScrollDialogProps) {
	const [scroll] = React.useState<"paper" | "body">("body");

	const handleClose = () => {
		setOpen(false);
	};

	const descriptionElementRef = React.useRef<HTMLElement>(null);
	React.useEffect(() => {
		if (open) {
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement !== null) {
				descriptionElement.focus();
			}
		}
	}, [open]);

	return (
		<>
			<Dialog
				open={open}
				onClose={handleClose}
				scroll={scroll}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
				<DialogContent sx={{ p: 0 }} dividers={true}>
					{children}
				</DialogContent>
				<DialogActions sx={{ display: closeButton ? undefined : "none" }}>
					<Button onClick={handleClose}>Cerrar</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};