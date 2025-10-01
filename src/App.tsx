import JobTimelineChart from "./components/JobTimelineChart";
import './App.css'
import JobDataTable from './components/JobDataTable';

 function App() {
  
  return (
    <>
      <h1>Job Updates</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <div >
          <JobTimelineChart />
        </div>
        <div>
          <JobDataTable />
        </div>
      </div>
    </>
  )
}

export default App
