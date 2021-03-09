import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import {loadJob} from './requests'

export function JobDetail({match:{params:{jobId}}}) {
  const [job,setJob] =useState(null)
  
  useEffect(() => {
    const getSingleJob =async () => {
      const job = await loadJob(jobId)
      setJob(job)
    }
    getSingleJob()
  },[jobId])
  if(!job){
    return null
  }
    return (
      <div>
        <h1 className="title">{job.title}</h1>
        <h2 className="subtitle">
          <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
        </h2>
        <div className="box">{job.description}</div>
      </div>
    );
 
}
