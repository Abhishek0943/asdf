import  { useState, useEffect } from "react";
 const API_URL = import.meta.env.VITE_API_URL;

 interface Credential {
  _id: string;
  payload: {
    user_id: string;
    name: string;
    email: string;
    role: string;
  };
  issued_at: string;
  worker_id: string;
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 useEffect(() => {
    const fetchCredentials = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL?API_URL +`/api/v1/all-credentials`:"api/v1/all-credentials");
        if (!res.ok) throw new Error("Failed to fetch credentials");
        const data= await res.json();
        setUsers(data.credentials);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    email: "",
    role: "",
  });

  const [mode, setMode] = useState<"issue" | "verify">("issue");
  const [open, setOpen] = useState(false);

  // Copy JSON to clipboard
  const copyToClipboard = (user: any) => {
    navigator.clipboard.writeText(JSON.stringify(user, null, 2));
    alert("Copied user JSON to clipboard!");
  };

  // Paste JSON from clipboard into modal form
  const pasteJson = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);
      setFormData({
        user_id: data.user_id || "",
        name: data.name || "",
        email: data.email || "",
        role: data.role || "",
      });
      alert("JSON data pasted successfully!");
    } catch {
      alert("Invalid JSON format in clipboard!");
    }
  };
const handleSubmit = async () => {
  const payload = { ...formData };
  if (!payload.user_id || !payload.name) {
    alert("Please fill all required fields!");
    return;
  }

  try {
    const apiUrl =
      mode === "issue"
        ?API_URL?  API_URL+"/api/v1/issuance":"api/v1/issuance"
        :API_URL? API_URL+ "/api/v1/verification":"api/v1/verification";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Handle issuance response
    if (mode === "issue") {
      if (data.success) {
        alert("✅ Credential issued successfully!");
      } else if (data.message) {
        alert("⚠️ " + data.message);
      } else {
        alert("⚠️ Issuance failed");
      }
    }

    // Handle verification response
    if (mode === "verify") {
      if (data.success || data.valid) {
        alert("✅ Credential verified successfully!");
      } else if (data.error) {
        alert("❌ " + data.error);
      } else {
        alert("❌ Verification failed");
      }
    }

    // setOpen(false);
  } catch (error: any) {
    alert("❌ API request failed: " + error.message);
  }
};
  if (loading) return <p>Loading credentials...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  // if (users?.length === 0) return <p>No credentials found</p>;
  return (
    <div>
      {/* Inline CSS */}
      <style>{`
        body, html, #root {
          margin: 0;
          padding: 0;
          font-family: "Segoe UI", sans-serif;
          background: #f7f9fb;
          color: #333;
          height: 100%;
        }

        .app {
          padding: 30px;
          max-width: 900px;
          margin: auto;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
          color: #111;
        }

        .btn-group {
          text-align: center;
          margin-bottom: 30px;
        }

        button {
          background: #4f46e5;
          border: none;
          color: white;
          padding: 10px 18px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
          margin: 0 6px;
          transition: 0.2s;
        }

        button:hover {
          background: #3730a3;
        }

        button.secondary {
          background: #e5e7eb;
          color: #111;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        th {
          background: #f3f4f6;
          font-weight: 600;
        }

        td:last-child {
          text-align: center;
        }

        .copy-btn {
          background: #10b981;
          padding: 6px 12px;
          font-size: 13px;
          border-radius: 5px;
          border: none;
          color: white;
        }

        .copy-btn:hover {
          background: #059669;
        }

        /* Modal */
        .modal {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: center;
        }

        .modal.active {
          display: flex;
        }

        .modal-content {
          background: white;
          padding: 25px;
          border-radius: 10px;
          width: 400px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .modal-content h2 {
          text-align: center;
          margin-top: 0;
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .form-group input {
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .close-btn {
          background: #ef4444;
          width: 100%;
          margin-top: 15px;
        }

        .close-btn:hover {
          background: #b91c1c;
        }
      `}</style>

      <div className="app">
        <h1>Credential Manager</h1>

        <div className="btn-group">
          <button onClick={() => { setMode("issue"); setOpen(true); }}>Issue</button>
          <button className="secondary" onClick={() => { setMode("verify"); setOpen(true); }}>Verify</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              users.length>0&& users.map((u:Credential, i) => (
              <tr key={i}>
                <td>{u.payload.user_id}</td>
                <td>{u.payload.name}</td>
                <td>{u.payload.email}</td>
                <td>{u.payload.role}</td>
                <td>
                  <button className="copy-btn" onClick={() => copyToClipboard(u.payload)}>Copy JSON</button>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>

        {/* Modal */}
        <div className={`modal ${open ? "active" : ""}`}>
          <div className="modal-content">
            <h2>{mode === "issue" ? "Issue Credential" : "Verify Credential"}</h2>

            {["user_id", "name", "email", "role"].map((field) => (
              <div className="form-group" key={field}>
                <label>{field}</label>
                <input
                  type="text"
                  value={(formData as any)[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
              </div>
            ))}

            <div className="modal-actions">
              <button className="secondary" onClick={pasteJson}>Paste JSON</button>
              <button onClick={handleSubmit}>{mode === "issue" ? "Issue" : "Verify"}</button>
            </div>

            <button className="close-btn" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
