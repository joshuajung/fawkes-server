"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = (app) => { };
class Scheduler {
    constructor(app, jobDefinitions) {
        this.jobs = [];
        this.app = app;
        this.jobs = jobDefinitions.map(jobDefinition => ({
            definition: jobDefinition,
            lastStart: null,
            lastCompletion: null
        }));
        console.log("Scheduler initialized.");
        this.stayInLoop();
    }
    stayInLoop() {
        this.runRequiredJobs();
        setTimeout(() => {
            this.stayInLoop();
        }, 5000);
    }
    runRequiredJobs() {
        this.jobs.forEach(job => {
            const jobEverRan = job.lastStart !== null;
            if (!jobEverRan) {
                this.runJob(job);
            }
            const jobIsRunning = job.lastCompletion === null || job.lastCompletion < job.lastStart;
            const secondsSinceLastStart = (Date.now() - job.lastStart.getTime()) / 1000;
            const jobIsDue = secondsSinceLastStart > job.definition.periodInSeconds;
            if (!jobIsRunning && jobIsDue) {
                this.runJob(job);
            }
        });
    }
    runJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Scheduler: Running job '" + job.definition.key + "'.");
            job.lastStart = new Date();
            try {
                yield job.definition.job(this.app);
            }
            catch (error) {
                console.error("Error during job.");
                console.error(error);
            }
            job.lastCompletion = new Date();
            console.log("Scheduler: Completed job '" + job.definition.key + "'.");
        });
    }
}
exports.Scheduler = Scheduler;
//# sourceMappingURL=scheduler.js.map