import { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import type { Job } from "../../types/jobs";
import { fetchAllJobs } from "../lib/api/jobs";

export default function JobDataTable() {
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

  if (!jobsData || jobsData.length === 0) {
  return <div>No job data available.</div>;
}
console.log("Table Data:", jobsData);
  const tableData = jobsData.flatMap((job) =>
    job.jobUpdates.map((update) => ({
        jobName: job.name,
        updateDate: update.updateDate,
        status: update.status.statusName,
        statedSalaryExpectation: job.statedSalaryExpectation,
        minSalaryExpectation: job.minSalaryExpectation,
        maxSalaryExpectation: job.maxSalaryExpectation,
    }))
  );

  const hasValidSalary = (salary:number | null) => {
    return salary !== null && salary !== undefined && salary > 0;
  }

    const formatSalaryK = (value: number | null) => {
    if (value == null) return "";
    const inThousands = value / 1000;

    return inThousands.toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
        minimumFractionDigits: inThousands % 1 === 0 ? 0 : 1, // no decimals if whole, 1 if not
        maximumFractionDigits: 1
    }) + "K";
    };

    const wageDisplayCalculation= (row: any) => {
        if (row.statedSalaryExpectation && row.statedSalaryExpectation === 0) return "N/A"; 
        
        let salaryExpectationString = '';
        const containsStatedSalary = hasValidSalary(row.statedSalaryExpectation);
        const containsMinSalary = hasValidSalary(row.minSalaryExpectation);
        const containsMaxSalary = hasValidSalary(row.maxSalaryExpectation);

        if (containsStatedSalary) {
            salaryExpectationString= `${formatSalaryK(row.statedSalaryExpectation)}`;
        } 
        if( containsMinSalary && containsMaxSalary){
            salaryExpectationString += ` (${formatSalaryK(row.minSalaryExpectation)} - ${formatSalaryK(row.maxSalaryExpectation)})`;;
        }
        return salaryExpectationString || "N/A";
        
    }

  const columns = [
    { name: "Job Name", selector: (row: any) => row.jobName, sortable: true, wrap:true },
    { name: "Company", selector: (row: any) => row.jobName, sortable: true },
    { name: "Salary", selector: (row: any) => { return wageDisplayCalculation(row)}, sortable: true, wrap: true },
    { 
      name: "Update Date", 
      selector: (row: any) => ["hellow", "world", row.updateDate].join(" - "), 
      sortable: true,
      format: (row: any) => new Date(row.updateDate).toLocaleDateString(),
      width: '150px',
      wrap:true
    },
    { name: "Status", selector: (row: any) => row.status, sortable: true },
    //{ name: "Known Dev Skills", selector: (row: any) => row.devSkills.filter(skill => skill.haveExperience).join(" - "), sortable: true, wrap:true },
    // { name: "Dev Skills To Learn", selector: (row: any) => row.devSkills.filter(skill => !skill.haveExperience).join(" - "), sortable: true, wrap:true },
  ];

  return (
    <div>
        <div style={{ minWidth: "500px", minHeight: "300px" }}>
      <h2>Job Application Table</h2>
      <DataTable
        columns={columns}
        data={tableData}
        pagination
        highlightOnHover
        striped
        responsive
      />
      </div>
    </div>
  );
}
