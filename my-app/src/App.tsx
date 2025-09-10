import Table from "./components/Table";

export default function App() {
  const headers = ["Name", "Age", "City"];
  const data = [
    ["Alice", 25, "London"],
    ["Bob", 30, "Manchester"],
    ["Charlie", 28, "Liverpool"],
  ];

  return <Table headers={headers} data={data} />;
}
