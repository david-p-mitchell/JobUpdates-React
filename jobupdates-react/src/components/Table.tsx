// Table.tsx
import React from "react";

type TableProps = {
  headers: string[];
  data: (string | number)[][];
};

const Table: React.FC<TableProps> = ({ headers, data }) => {
  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="border px-2 py-1">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => (
              <td key={c} className="border px-2 py-1">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
