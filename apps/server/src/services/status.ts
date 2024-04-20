export enum Process {
  JobRunner,
  Server,
}

export interface ProcessStatus {
  processesReady(): boolean;
  ready(): boolean;
  registerProcessReady(process: Process): void;
}

export class ProcessStatusImpl implements ProcessStatus {
  private readyProcesses = new Set<Process>();

  ready(): boolean {
    return this.processesReady();
  }

  processesReady(): boolean {
    return this.readyProcesses.size === 2;
  }

  registerProcessReady(process: Process): void {
    this.readyProcesses.add(process);
  }
}
