import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function MDScrollDialog({
	open,
	setOpen,
	title,
	closeButton = true,
	children,
}) {
	// const [open, setOpen] = React.useState(false);
	const [scroll, setScroll] = React.useState("body");

	// const handleClickOpen = (scrollType) => () => {
	// 	setOpen(true);
	// 	// setScroll(scrollType);
	// };

	const handleClose = () => {
		setOpen(false);
	};

	const descriptionElementRef = React.useRef(null);
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
			{/* <Button onClick={handleClickOpen()}>scroll=paper</Button>
			<Button onClick={handleClickOpen()}>scroll=body</Button> */}
			<Dialog
				// sx={{ width: "90%" }}
				open={open}
				onClose={handleClose}
				scroll={scroll}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
				<DialogContent sx={{ p: 0 }} dividers={true}>
					{children}
					{/* Hola que tal como estas? */}
				</DialogContent>
				<DialogActions sx={{ display: closeButton ? `` : `none` }}>
					<Button onClick={handleClose}>Cerrar</Button>
					{/* <Button onClick={handleClose}>Actualizar</Button> */}
				</DialogActions>
			</Dialog>
		</>
	);
}
