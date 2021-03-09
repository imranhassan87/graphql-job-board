import {ApolloClient,HttpLink,InMemoryCache,ApolloLink} from 'apollo-boost'
import gql from 'graphql-tag'
import {getAccessToken,isLoggedIn} from './auth'

const endpoint = 'http://localhost:9000/graphql'

const authLink = new ApolloLink((operation,forward) => {
    if(isLoggedIn()){
        operation.setContext({
            headers:{
                'authorization':`Bearer ${getAccessToken()}`
            }
        })
    }
    return forward(operation)
})

const client = new ApolloClient({
    link:ApolloLink.from([
        authLink,
        new HttpLink({uri:endpoint})
    ]) ,
    cache: new InMemoryCache()
})

const jobDetailFragment = gql`
fragment jobDetails on Job {
        id
        title
        description
        company {
          id
          name
          description
        }
}
`


const JobsQuery=gql`{
    jobs{
        id
        title
        company {
          id
          name
        }
      }
    }
    `

const JobQuery =gql`query jobQuery($id:ID!){
    job(id:$id){
        ...jobDetails
      }
    }
    ${jobDetailFragment}
    `
    const CompanyQuery =gql`query companyQuery($id:ID!){
        company(id:$id){
            id
            name
            description
            jobs {
                id
                title
            }
        }
    }`

const CreateJobMutation =gql`mutation createJob($input:CreateJobInput) {
    job: createJob(input:$input){
       ...jobDetails
     }
   }
   ${jobDetailFragment}
   `
    
export async function loadJob(id) {
    const {data: {job}} = await client.query({query:JobQuery,variables:{id}})
    return job;
}
export async function loadJobs() {
    
        const {data: {jobs}} = await client.query({query:JobsQuery,fetchPolicy:"no-cache"})
    return jobs;

}

export async function loadCompany (id){
    
    const {data: {company}} = await client.query({query:CompanyQuery,variables:{id}})
    return company
}
export async function createJob (input){


    const {data:{job}} = await client.mutate({
        mutation:CreateJobMutation,
        variables:{input},
        update:((cache,{data}) => cache.writeQuery({query:JobQuery,
            variables:{id:data.job.id},
            data
        }))})
    return job
}