import { useState } from "react";
import * as XLSX from "xlsx";
// MUI ICONS
import SaveIcon from "@mui/icons-material/Save";

import MDButton from "components/MDButton";
import { formateDate } from "helpers/formatDate";
import { Box } from "@mui/material";

interface Header {
	title: string;
	// field: string;
	width?: number;
}

interface JsonToExcelProps<T> {
	headers: Header[];
	data: T[];
	fileName?: string;
	sheetName?: string;
	title?: string;
	additionalInfoP?: string;
}

export default function JsonToExcel<T>({
	headers,
	data,
	fileName = `Reporte ${formateDate(
		new Date(),
		"dddd, DD-MM-YYYY HH:mm:ss"
	)}.xlsx`,
	sheetName = "Hoja1",
	title = "Reporte generado",
	additionalInfoP = "Creado por: Skyline2154",
}: JsonToExcelProps<T>) {
	const [loading, setLoading] = useState(false);

	const handleDownload = () => {
		setLoading(true);

		setTimeout(() => {
			createExcelFile(headers, data, title, additionalInfoP);
			setLoading(false);
		}, 1000);
	};

	const createExcelFile = (
		headers: Header[],
		rows: any[],
		title: string,
		additionalInfo: string
	) => {
		const headerTitles = headers.map((header) => header.title);

		const worksheet = XLSX.utils.json_to_sheet([]);

		XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: "A1" });

		XLSX.utils.sheet_add_aoa(worksheet, [headerTitles], { origin: "A3" });

		XLSX.utils.sheet_add_json(worksheet, rows, {
			skipHeader: true,
			origin: "A4",
		});

		worksheet["!cols"] = headers.map((header) => ({ wch: header.width }));

		const finalRow = rows.length + 5;

		XLSX.utils.sheet_add_aoa(worksheet, [[additionalInfo]], {
			origin: `A${finalRow}`,
		});

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

		XLSX.writeFile(workbook, fileName);
	};

	return (
		<Box px={2} pt={2}>
			{!loading ? (
				<MDButton
					color="success"
					startIcon={<SaveIcon />}
					onClick={handleDownload}
					sx={{ width: 200 }}
				>
					Exportar Excel
				</MDButton>
			) : (
				<MDButton
					startIcon={<SaveIcon />}
					color="info"
					disabled
					sx={{ width: 200 }}
				>
					Guardando
				</MDButton>
			)}
		</Box>
	);
}
