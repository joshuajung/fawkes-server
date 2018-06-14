import { App } from "../types";
export interface ScheduledJobDefinition {
    key: string;
    periodInSeconds: number;
    job: (app: App) => Promise<any>;
}
export interface ScheduledJob {
    definition: ScheduledJobDefinition;
    lastStart: Date;
    lastCompletion: Date;
}
export declare const start: (app: App) => void;
export declare class Scheduler {
    app: App;
    jobs: Array<ScheduledJob>;
    constructor(app: App, jobDefinitions: Array<ScheduledJobDefinition>);
    stayInLoop(): void;
    runRequiredJobs(): void;
    runJob(job: ScheduledJob): Promise<void>;
}
