import { useEffect, useState } from "react";
// Thank stack functions
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	type ColumnDef,
	type SortingState,
} from "@tanstack/react-table";
// MUI Components
import {
	Box,
	Paper,
	TextField,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Divider,
	Grid,
	Stack,
	Pagination,
	IconButton,
	styled,
	tableCellClasses,
	TableFooter,
	type TextFieldProps,
	Typography,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	OutlinedInput,
	InputAdornment,
} from "@mui/material";
// MUI Icons
import FirstPageRoundedIcon from "@mui/icons-material/FirstPageRounded";
import LastPageRoundedIcon from "@mui/icons-material/LastPageRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface TableProps {
	data: any[]; // Replace `any[]` with your actual data structure
	columns: ColumnDef<any>[]; // Replace `any` with your column type
	filter?: boolean; // Replace `any` with your
	showPerRow?: boolean;
}
interface DebouncedInputProps extends Omit<TextFieldProps, "onChange"> {
	value: string | number;
	onChange: (value: string | number) => void;
	debounce?: number;
}

export default function MainTable({
	data,
	columns,
	filter = false,
	showPerRow = false,
}: TableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [filtering, setFiltering] = useState("");

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			globalFilter: filtering,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setFiltering,
		filterFromLeafRows: true, // filter and search  through sub-rows
		debugTable: true,
		debugHeaders: true,
		debugColumns: false,
	});

	return (
		<TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
			<Stack
				direction={"row"}
				// width={1}
				// bgcolor={'red'}
				justifyContent={"space-between"}
				marginY={1}
			>
				{showPerRow && (
					<FormControl>
						<InputLabel id="label">Filas por pagina</InputLabel>
						<Select
							variant="standard"
							// label="Filas por página"
							value={table.getState().pagination.pageSize}
							onChange={(e) => table.setPageSize(Number(e.target.value))}
							// SelectProps={{ native: true }}
							sx={{ mx: 0, mt: 0.5, minWidth: 150, p: 0.5, borderRadius: 2 }}
						>
							{[5, 10, 20, 50].map((size) => (
								<MenuItem key={size} value={size}>
									{size}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				)}
				{filter && (
					<Box
					// bgcolor={'yellow'}
					>
						<DebouncedInput
							id="outlined-basic-search-table"
							type="text"
							variant="outlined"
							label="Buscar..."
							value={filtering ?? ""}
							onChange={(value) => setFiltering(String(value))}
							placeholder="Buscar..."
							color="success"
						/>
					</Box>
				)}
			</Stack>

			<Table stickyHeader aria-label="simple table">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							sx={{ borderBottom: "5px solid white", backgroundColor: "" }}
							key={headerGroup.id}
						>
							{headerGroup.headers.map((header) => (
								<StyledTableCell
									key={header.id}
									onClick={header.column.getToggleSortingHandler()}
									sx={{ fontWeight: "bold", cursor: "pointer" }}
									align="center"
								>
									{header.isPlaceholder ? null : (
										<div>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}

											{
												{
													asc: " ▲",
													desc: " ▼ ",
												}[(header.column.getIsSorted() as string) ?? null]
											}
										</div>
									)}
								</StyledTableCell>
							))}
						</TableRow>
					))}
				</thead>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<StyledTableRow key={row.id} hover role="checkbox">
							{row.getVisibleCells().map((cell) => (
								<StyledTableCell key={cell.id} align="center">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</StyledTableCell>
							))}
						</StyledTableRow>
					))}
				</TableBody>
				<TableFooter>
					{table.getFooterGroups().map((footerGroup) => (
						<TableRow key={footerGroup.id}>
							{footerGroup.headers.map((footer) => (
								<TableCell key={footer.id}>
									{flexRender(
										footer.column.columnDef.footer,
										footer.getContext()
									)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableFooter>
			</Table>

			<Stack direction={"row"} justifyContent={"space-between"}>
				<Typography variant="body2" sx={{ alignSelf: "center", mx: 2 }}>
					Página {table.getState().pagination.pageIndex + 1} de{" "}
					{table.getPageCount()}
				</Typography>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						py: 2,
					}}
				>
					<IconButton
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
						sx={{
							color: table.getCanPreviousPage() ? "warning.main" : "grey.400",
						}}
					>
						<FirstPageRoundedIcon />
					</IconButton>

					<IconButton
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						sx={{
							color: table.getCanPreviousPage() ? "warning.main" : "grey.400",
						}}
					>
						<SkipPreviousRoundedIcon />
					</IconButton>

					{/* <Typography variant="body2" sx={{ mx: 2 }}>
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </Typography> */}

					<IconButton
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						sx={{ color: table.getCanNextPage() ? "success.main" : "grey.400" }}
					>
						<SkipNextRoundedIcon />
					</IconButton>

					<IconButton
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
						sx={{ color: table.getCanNextPage() ? "success.main" : "grey.400" }}
					>
						<LastPageRoundedIcon />
					</IconButton>
				</Box>
			</Stack>
		</TableContainer>
	);
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

// A typical debounced input react component
const DebouncedInput: React.FC<DebouncedInputProps> = ({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}) => {
	const [value, setValue] = useState<string | number>(initialValue);

	// Sincronizar el valor inicial cuando cambia
	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	// Efecto de debounce
	useEffect(() => {
		const handler = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => {
			clearTimeout(handler);
		};
	}, [value, onChange, debounce]);

	// Manejar cambios locales
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	return (
		<FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
			<InputLabel htmlFor="outlined-adornment-password">Buscar</InputLabel>
			<OutlinedInput
				id="outlined-adornment-password"
				type={"text"}
				placeholder="Buscar..."
				value={value}
				onChange={handleChange}
				endAdornment={
					<InputAdornment position="end">
						<IconButton aria-label="toggle password visibility" edge="end">
							<SearchRoundedIcon />
						</IconButton>
					</InputAdornment>
				}
				label="Password"
			/>
		</FormControl>
	);
};
