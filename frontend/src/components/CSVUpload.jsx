import { useState } from "react";
import axios from "axios";
import "./CSVUpload.css";

const API = "http://localhost:5000/api/import_csv";

export default function CSVUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [importedCount, setImportedCount] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    if (!file.name.endsWith(".csv")) {
      setMessage("Only CSV files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      setImportedCount(null);

      const res = await axios.post(API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImportedCount(res.data.created?.length || 0);
      setMessage("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to import CSV. Please check your file format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-upload-container">
      <h2>Import Events via CSV</h2>
      <div className="upload-box">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>

      {message && <p className="upload-message">{message}</p>}

      {importedCount !== null && (
        <p className="upload-result">Imported: {importedCount} events</p>
      )}
    </div>
  );
}
