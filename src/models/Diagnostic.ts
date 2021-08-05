import {Diagnostic, EngineResult, Solution, Symptom,} from 'wellbeyond-diagnostic-engine';

export interface SolutionResult {
  symptomId: string;
  solutionId: string;
  symptom: string;
  solution: string;
  didItWork?: string;
  photo?: string;
  information?: string;
}

export interface DiagnosticResult {
  diagnosticId: string;
  question: string;
  answer?: string;
}


export interface SymptomResult {
  symptomId: string;
  symptom: string;
  resolved: boolean;
}

export interface DiagnosticLog {
  id: string;
  name: string;
  organizationId: string;
  community: string;
  systemId: string;
  userId?: string;
  archived?: boolean;
  started?: Date;
  completed?: Date;
  status: 'open' | 'resolved' | 'partial' | 'unresolved';
  symptoms?: SymptomResult[];
  diagnosticResults: DiagnosticResult[];
  solutionResults: SolutionResult[];
  engineResult?: EngineResult;
}

export type {
  Diagnostic,
  Solution,
  Symptom
};
