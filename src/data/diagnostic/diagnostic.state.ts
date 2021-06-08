import {Symptom, Solution, FactQuestion, DiagnosticLog} from '../../models/Diagnostic';
import {Diagnostics, Almanac} from 'wellbeyond-diagnostic-engine'

export interface DiagnosticState {
  symptoms: Symptom[];
  solutions: Solution[];
  facts: FactQuestion[];
  diagnosticLogs: DiagnosticLogs;
  engine?: Diagnostics;
  almanac?: Almanac;
}

export interface DiagnosticLogs {
  [id: string]: DiagnosticLog;
}
