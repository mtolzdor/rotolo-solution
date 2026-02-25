import { useState, useEffect } from "react";
import "./App.css";

const PAGE_SIZE = 20;

function App() {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const headers = {
    "QB-Realm-Hostname": "rotoloconsultants.quickbase.com",
    //prettier-ignore
    "Authorization": "QB-USER-TOKEN caxzws_ppjb_0_ddafux7uz74djcq3zj5pdzatwjm",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.quickbase.com/v1/records/query", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            from: "bvszjwvtq",
            select: [3, 6, 7, 8, 9, 10],
            where: "{'9'.EX.'Scheduled'}",
            sortBy: [{ fieldId: 8, order: "ASC" }],
          }),
        });
        const result = await res.json();
        console.log(result.data);
        console.log(result.fields);
        setData(result.data);
        setLabels(result.fields);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const pageData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container">
      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="job-table">
        <thead>
          <tr>
            {labels.map((label: any) => (
              <th key={label.id}>{label.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((item: any) => (
            <tr key={item[3]?.value}>
              <td>{item[3]?.value}</td>
              <td>{item[6]?.value}</td>
              <td>{item[7]?.value}</td>
              <td>{item[8]?.value}</td>
              <td>{item[9]?.value}</td>
              <td>{item[10]?.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={p === page ? "page-btn active" : "page-btn"}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next →
          </button>
          <span className="page-meta">
            {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, data.length)} of {data.length}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
