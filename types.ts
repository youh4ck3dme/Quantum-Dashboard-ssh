
export enum Status {
  Online = 'Online',
  Offline = 'Offline',
  Calibrating = 'Calibrating',
  Busy = 'Busy',
}

export interface QuantumBackend {
  name: string;
  status: Status;
  queue: number;
  qubits: number;
}

export enum JobStatus {
  Pending = 'Pending',
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
}

export interface Job {
  id: string;
  model: string;
  backend: string;
  status: JobStatus;
  submitted: string;
}

export interface AIModel {
    name: string;
    type: 'LLM' | 'Quantum Kernel' | 'Variational Circuit';
    format: 'safetensors' | 'GGUF' | 'QPY';
    description: string;
}
