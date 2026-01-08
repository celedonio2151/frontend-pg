import { useState } from "react";
import * as XLSX from "xlsx";
// MUI ICONS
import SaveIcon from "@mui/icons-material/Save";

import MDButton from "components/MDButton";
import { formateDate } from "helpers/formatDate";
import { Box } from "@mui/material";

export interface ExportHeadersExcel {
	title: string;
	// Optional: key/property name to read from each data row. If omitted, title will be used.
	key?: string;
	width?: number;
}

interface JsonToExcelProps {
	headers: ExportHeadersExcel[];
	data: any[];
	fileName?: string;
	sheetName?: string;
	title?: string;
	additionalInfoP?: string;
}

export default function JsonToExcel({
	headers,
	data,
	fileName = `Reporte ${formateDate(
		new Date(),
		"dddd, DD-MM-YYYY HH:mm:ss"
	)}.xlsx`,
	sheetName = "Hoja1",
	title = "Reporte generado",
	additionalInfoP = "Creado por: Skyline2154",
}: JsonToExcelProps) {
	const [loading, setLoading] = useState(false);

	const handleDownload = () => {
		setLoading(true);

		setTimeout(() => {
			createExcelFile(headers, data, title, additionalInfoP);
			setLoading(false);
		}, 1000);
	};

	const createExcelFile = (
		headers: ExportHeadersExcel[],
		rows: any[],
		title: string,
		additionalInfo: string
	) => {
		// Titles shown in the sheet (A3 row)
		const headerTitles = headers.map((header) => header.title);

		// Keys used to extract values from each row and to enforce column order
		const headerKeys = headers.map((header) => header.key ?? header.title);

		const worksheet = XLSX.utils.json_to_sheet([]);

		XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: "A1" });

		XLSX.utils.sheet_add_aoa(worksheet, [headerTitles], { origin: "A3" });

		// Add rows forcing the header order to headerKeys so values align with titles
		XLSX.utils.sheet_add_json(worksheet, rows, {
			skipHeader: true,
			origin: "A4",
			header: headerKeys,
		});

		// Ensure sensible widths (number of characters) when width is not provided
		worksheet["!cols"] = headers.map((header) => ({ wch: header.width ?? 15 }));

		const finalRow = rows.length + 5;

		XLSX.utils.sheet_add_aoa(worksheet, [[additionalInfo]], {
			origin: `A${finalRow}`,
		});

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
		const outName = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
		XLSX.writeFile(workbook, outName);
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
