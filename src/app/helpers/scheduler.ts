// External imports

// Internal imports
import { App } from "../types"

export interface ScheduledJobDefinition {
  key: string
  periodInSeconds: number
  job: (app: App) => Promise<any>
}

export interface ScheduledJob {
  definition: ScheduledJobDefinition
  lastStart: Date
  lastCompletion: Date
}

export const start = (app: App) => {}

export class Scheduler {
  app: App
  jobs: Array<ScheduledJob> = []
  constructor(app: App, jobDefinitions: Array<ScheduledJobDefinition>) {
    this.app = app
    this.jobs = jobDefinitions.map(jobDefinition => ({
      definition: jobDefinition,
      lastStart: null,
      lastCompletion: null
    }))
    console.log("Scheduler initialized.")
    this.stayInLoop()
  }
  stayInLoop() {
    // console.log("Scheduler: Loop ping.")
    this.runRequiredJobs()
    setTimeout(() => {
      this.stayInLoop()
    }, 5000)
  }
  runRequiredJobs() {
    this.jobs.forEach(job => this.runJobIfRequired(job))
  }
  runJobIfRequired(job: ScheduledJob) {
    const jobEverRan = job.lastStart !== null
    if (!jobEverRan) {
      this.runJob(job)
    }
    const jobIsRunning =
      job.lastCompletion === null || job.lastCompletion < job.lastStart
    const secondsSinceLastStart = (Date.now() - job.lastStart.getTime()) / 1000
    const jobIsDue = secondsSinceLastStart > job.definition.periodInSeconds
    if (!jobIsRunning && jobIsDue) {
      this.runJob(job)
    }
  }
  async runJob(job: ScheduledJob) {
    console.log("Scheduler: Running job '" + job.definition.key + "'.")
    job.lastStart = new Date()
    try {
      await job.definition.job(this.app)
    } catch (error) {
      console.error("Error during job.")
      console.error(error)
    }
    job.lastCompletion = new Date()
    console.log("Scheduler: Completed job '" + job.definition.key + "'.")
    this.runJobIfRequired(job)
  }
}
