import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

const CSVTool = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split("\n").map(row => row.split(","));
        setCsvData(rows);
        toast.success("CSV file uploaded successfully");
      };
      reader.readAsText(file);
    }
  };

  const handleCellEdit = (rowIndex, cellIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][cellIndex] = value;
    setCsvData(newData);
  };

  const handleAddRow = () => {
    const newRow = new Array(csvData[0]?.length).fill("");
    setCsvData([...csvData, newRow]);
    toast.success("New row added");
  };

  const handleDeleteRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
    toast.success("Row deleted");
  };

  const handleDownload = () => {
    const content = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName || "data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    toast.success("CSV file downloaded");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">CSV Management Tool</h1>
      <p className="text-gray-600 mb-4">Upload, view, edit, and download CSV files</p>

      <div className="mb-4 flex items-center">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mr-2"
        />
        {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
      </div>

      {csvData.length > 0 && (
        <>
          <div className="overflow-x-auto mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {csvData[0].map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvData.slice(1).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Input
                          value={cell}
                          onChange={(e) => handleCellEdit(rowIndex + 1, cellIndex, e.target.value)}
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRow(rowIndex + 1)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between">
            <Button onClick={handleAddRow}>
              <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> Download CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CSVTool;