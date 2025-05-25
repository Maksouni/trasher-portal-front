import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Наименование",
    width: 150,
    editable: false,
  },
  {
    field: "confidence",
    headerName: "Точность",
    type: "number",
    width: 150,
    editable: false,
  },
];

const rows = [
  { id: 1, name: "juice-cardboard", confidence: 0.14 },
  { id: 2, name: "bottle-yogurt", confidence: 0.31 },
  { id: 3, name: "bottle-transparent", confidence: 0.36 },
  { id: 4, name: "detergent-color", confidence: 0.11 },
  { id: 5, name: "bottle-oil", confidence: 0.54 },
  { id: 6, name: "milk-cardboard", confidence: 0.13 },
  { id: 7, name: "bottle-multicolory-full", confidence: 0.36 },
  { id: 8, name: "bottle-transp", confidence: 0.78 },
  { id: 9, name: "bottle-green", confidence: 0.65 },
  { id: 10, name: "detergent-white", confidence: 0.89 },
  { id: 11, name: "bottle-transparent", confidence: 0.36 },
  { id: 12, name: "juice-cardboard", confidence: 0.14 },
  { id: 13, name: "detergent-white", confidence: 0.89 },
  { id: 14, name: "bottle-green", confidence: 0.65 },
  { id: 15, name: "detergent-color", confidence: 0.11 },
  { id: 16, name: "bottle-transp", confidence: 0.78 },
  { id: 17, name: "milk-cardboard", confidence: 0.13 },
  { id: 18, name: "bottle-multicolory-full", confidence: 0.36 },
  { id: 19, name: "bottle-yogurt", confidence: 0.31 },
  { id: 20, name: "bottle-oil", confidence: 0.54 },
];

export default function StreamLogs() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
      />
    </div>
  );
}
