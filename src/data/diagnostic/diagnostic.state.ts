import {Diagnostic, DiagnosticLog, Solution, Symptom} from '../../models/Diagnostic';
import {Almanac, DiagnosticEngine} from 'wellbeyond-diagnostic-engine'

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
