const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllJobs = async () => {
  console.log("Fetching jobs from:", BASE_URL);
  const response = await fetch(`${BASE_URL}/jobs/GetAll`);
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
};
