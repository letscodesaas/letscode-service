import {QueueInstance} from "@letscode/queues/queues";
export const queue = async(qname:string,jobname:string, data:any)=>{
    try {
        const q = new QueueInstance("",qname);
        await q.addJob(jobname,data);
    } catch (error) {
        throw new Error(String(error))
    }
}