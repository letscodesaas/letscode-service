import {WorkerInstance} from "@letscode/queues/queues";

export const worker_runner = async(qname:string,cb:Function)=>{
    try {
        const w = new WorkerInstance("",qname);
        await w.worker((job)=>cb(job));
    } catch (error) {
        throw new Error(String(error))
    }
}