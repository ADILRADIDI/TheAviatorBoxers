import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const queue = new Queue("aviator", { connection });
const worker = new Worker("aviator", async (job) => {
  console.log(`Processing ${job.name} (${job.id})`);
}, { connection });

worker.on("completed", (job) => console.log(`Completed ${job.id}`));
worker.on("failed", (job, error) => console.error(`Failed ${job?.id}`, error));

console.log(`Aviator worker ready; queue=${queue.name}`);