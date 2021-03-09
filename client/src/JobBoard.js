import React, {  useEffect, useState } from 'react';
import { JobList } from './JobList';
import {loadJobs} from './requests'


export function JobBoard() {
   const [jobs,setJobs] = useState([])
   useEffect(() => {
    const getJobs = async () => {
      const loadedJobs =await loadJobs()
      setJobs(loadedJobs)
    }
    getJobs()
   },[])
    return (
      <div>
        <h1 className="title">Job Board</h1>
        <JobList jobs={jobs} />
      </div>
    );
  
}
