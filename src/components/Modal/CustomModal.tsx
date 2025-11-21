import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Typography,
	Box,
} from "@mui/material";
import { type ReactNode } from "react";
// MUI ICONS
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MDButton from "components/MDButton";

interface ModalConfirmDialogProps {
	open: boolean;
	title?: string;
	content?: ReactNode;
	confirmText?: string;
	cancelText?: string;
	onClose: () => void;
	onConfirm: () => void;
}

export default function CustomModal({
	open,
	title = "¿Estás seguro?",
	content = "Esta acción no se puede deshacer.",
	confirmText = "Aceptar",
	cancelText = "Cancelar",
	onClose,
	onConfirm,
}: ModalConfirmDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
			<DialogTitle>
				<Typography variant="h6">{title}</Typography>
				<IconButton
					onClick={onClose}
					sx={{ position: "absolute", right: 12, top: 12 }}
					aria-label="Cerrar"
				>
					<CloseRoundedIcon color="inherit" />
				</IconButton>
			</DialogTitle>

			<DialogContent>
				{typeof content === "string" ? (
					<Typography variant="body1">{content}</Typography>
				) : (
					<Box>{content}</Box>
				)}
			</DialogContent>

			<DialogActions sx={{ p: 2 }}>
				<MDButton onClick={onClose} color="light">
					{cancelText}
				</MDButton>
				<MDButton onClick={onConfirm} variant="gradient" color="error">
					{confirmText}
				</MDButton>
			</DialogActions>
		</Dialog>
	);
}
