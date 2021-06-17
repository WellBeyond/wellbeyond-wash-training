import {Symptom, Solution, Diagnostic, } from 'wellbeyond-diagnostic-engine';

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
  symptoms?: string[];
}

export type {
  Diagnostic,
  Solution,
  Symptom
};
