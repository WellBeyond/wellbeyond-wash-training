import {Symptom, Solution, Diagnostic, DiagnosticLog} from '../../models/Diagnostic';
import {DiagnosticEngine, Almanac} from 'wellbeyond-diagnostic-engine'

export interface DiagnosticState {
  symptoms: Symptom[];
  solutions: Solution[];
  diagnostics: Diagnostic[];
  diagnosticLogs: DiagnosticLogs;
  engine?: DiagnosticEngine;
  almanac?: Almanac;
}

export interface DiagnosticLogs {
  [id: string]: DiagnosticLog;
}
