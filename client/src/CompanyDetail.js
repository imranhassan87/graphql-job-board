import React, { useState,useEffect } from 'react';
import { JobList } from './JobList';
import {loadCompany} from './requests'


export function CompanyDetail ({match:{params:{companyId}}}) {
  const [company,setCompany] =useState(null)
  
  useEffect(() => {
    const getSingleCompany =async () => {
      const company = await loadCompany(companyId)
      setCompany(company)
    }
    getSingleCompany()
  },[companyId])
  if(!company){
    return null
  }

    return (
      <div>
        <h1 className="title">{company.name}</h1>
        <div className="box">{company.description}</div>
        <JobList jobs={company.jobs} />
      </div>
    );

}
