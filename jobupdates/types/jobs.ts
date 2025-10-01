type JobStatus = {
  statusName: string;
};

type JobUpdate = {
  status: JobStatus;
  updateDate: string; // YYYY-MM-DD
};

type Job = {
  id: number;
  name: string;
  statedSalaryExpectation: number | null;
  minSalaryExpectation: number | null;
  maxSalaryExpectation: number | null;
  company: string;
  jobUpdates: JobUpdate[];
};

type JobGraph = {
  job: Job;
  color: string;
};

export type { JobGraph, JobUpdate, Job };