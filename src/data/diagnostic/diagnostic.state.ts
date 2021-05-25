import {Symptom, Solution, FactQuestion, DiagnosticLog} from '../../models/Diagnostic';

export interface DiagnosticState {
  symptoms: Symptom[];
  solutions: Solution[];
  facts: FactQuestion[];
  diagnosticLogs: DiagnosticLogs;
}

export interface DiagnosticLogs {
  [id: string]: DiagnosticLog;
}
