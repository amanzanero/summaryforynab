import type { ServerEnvironment } from "./env";

export enum Process {
  JobRunner,
  Server,
}

export interface ProcessStatus {
  processesReady(): boolean;
  ready(): boolean;
  registerHealthCheckReady(): void;
  registerProcessReady(process: Process): void;
}

export class ProcessStatusImpl implements ProcessStatus {
  private readyProcesses = new Set<Process>();
  private healthCheckReady = false;
  private env: ServerEnvironment;

  constructor(env: ServerEnvironment) {
    this.env = env;
  }

  ready(): boolean {
    if (this.env.NODE_ENV === "development") {
      return this.processesReady();
    } else {
      return this.healthCheckReady && this.processesReady();
    }
  }

  registerHealthCheckReady(): void {
    this.healthCheckReady = true;
  }

  processesReady(): boolean {
    return this.readyProcesses.size === 2;
  }

  registerProcessReady(process: Process): void {
    this.readyProcesses.add(process);
  }
}
