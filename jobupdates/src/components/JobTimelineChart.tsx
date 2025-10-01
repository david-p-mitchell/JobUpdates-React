import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import type { Job } from "../../types/jobs";
import { useState, useEffect } from "react";
import annotationPlugin from "chartjs-plugin-annotation";
import { fetchAllJobs } from "../lib/api/jobs";

// Register Chart.js features
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  annotationPlugin
);


export default function JobTimelineChart() {
  const [jobsData, setJobsData] = useState<Job[] | null>(null);
  
  useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchAllJobs();
          setJobsData(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }, []);
  
  const jobs = jobsData ?? [];
  // 
  if (!jobs || jobs.length === 0) {
    return <div>No job data available.</div>;
  }
  
  jobs.forEach(job => {
  // Check if there is already a stage for today
  const hasTodayStage = job.jobUpdates.some(stage => new Date(stage.updateDate) >= new Date(new Date().toISOString().split('T')[0]));
  
  if (!hasTodayStage) {
    // Find the latest stage before today
    const latestStage = job.jobUpdates
      .filter(stage => new Date(stage.updateDate) <= new Date(new Date().toISOString().split('T')[0]))
      .sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime())[0];
    
    // Add a stage for today with the current status
    job.jobUpdates.push({
      status: { statusName: String(latestStage?.status.statusName ?? "Created") },
      updateDate: new Date().toISOString().split('T')[0]
    });
  }
});




const colors = [
  "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8DD1E1", "#D9D9D9"
];

  // Convert jobs into datasets
  const chartData = {
  datasets: jobs.map((job, index) => ({
    label: `${job.name}`,
    data: job.jobUpdates.map((s) => ({ x: s.updateDate, y: s.status.statusName })),
    borderColor: colors[index % colors.length],
    backgroundColor: colors[index % colors.length],
    tension: 0.4,
  })),
};

const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD only
  
const options = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" as const },
    annotation: {
      annotations: {
        todayLine: {
          type: "line" as const,   // <-- not "string", but literal type
          xMin: today,
          xMax: today,
          borderColor: "#dddd",
          borderWidth: 2,
          borderDash: [6, 6],
        },
      },
    },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      type: "time" as const,
      time: { unit: "day" as const },
      title: { display: true, text: "Date" },
    },
    y: {
      type: "category" as const,
      labels: [
        "Offer",
        "Interview",
        "Screening/ Pre-Interview",
        "Scheduled Phone Call",
        "Awaiting Response",
        "Holding CV",
        "Applied",
        "Rejection",
        "Created",
      ],
      title: { display: true, text: "Stage" },
    },
  },
};


  return (
    <div>
      <h2>Job Application Timeline</h2>
      <div style={{ minWidth: "600px", minHeight: "300px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
