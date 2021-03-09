const db  = require('./db')
const Query = {
    job:(parent,{id}) => db.jobs.get(id),
    jobs:() => db.jobs.list(),
    company:(parent,{id}) => db.companies.get(id)
}

const Mutation = {
    createJob:(parent,{input},{user}) => {
        if(!user){
            throw new Error("Not Authorized!");
        }
        const id = db.jobs.create({...input,companyId:user.companyId})
        return db.jobs.get(id)
    }
}

const Company = {
    jobs:(company) => db.jobs.list().filter(job => job.companyId === company.id) 
}

const Job = {
    company: (job) => db.companies.get(job.companyId)
}



module.exports = {Query,Job ,Company,Mutation}