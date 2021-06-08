import {ActionType} from '../../util/types';
import {createOrUpdateDiagnosticLog, listenForDiagnosticData, listenForDiagnosticLogs} from "./diagnosticApi";
import {DiagnosticLogs, DiagnosticState} from "./diagnostic.state";
import {Symptom, Solution, DiagnosticLog, FactQuestion} from "../../models/Diagnostic";
import {Diagnostics, Almanac} from 'wellbeyond-diagnostic-engine'
import {System} from "../../models/Maintenance";
import React from "react";

const listeners:{symptoms?:any, solutions?:any, facts?: any, diagnosticLogs?:any} = {};

export const loadDiagnosticData = (organizationId:string) => (async (dispatch: React.Dispatch<any>) => {
  if (listeners.symptoms && typeof listeners.symptoms === 'function') {
    listeners.symptoms();
  }
  listenForDiagnosticData('symptoms', organizationId, (symptoms: Symptom[]) => {
    dispatch(setSymptoms(symptoms));
  }).then(listener => {
    listeners.symptoms = listener;
  });

  if (listeners.solutions && typeof listeners.solutions === 'function') {
    listeners.solutions();
  }
  listenForDiagnosticData('solutions', organizationId, (solutions: Solution[]) => {
    dispatch(setSolutions(solutions));
  }).then(listener => {
    listeners.solutions = listener;
  });

  if (listeners.facts && typeof listeners.facts === 'function') {
    listeners.facts();
  }
  listenForDiagnosticData('facts', organizationId, (facts: FactQuestion[]) => {
    dispatch(setFacts(facts));
  }).then(listener => {
    listeners.facts = listener;
  });
});

export const loadDiagnosticLogs = (system:System) => (async (dispatch: React.Dispatch<any>) => {
  if (listeners.diagnosticLogs && typeof listeners.diagnosticLogs === 'function') {
    listeners.diagnosticLogs();
  }
  listenForDiagnosticLogs(system, (DiagnosticLogs: DiagnosticLogs) => {
    dispatch(setDiagnosticLogs(DiagnosticLogs));
  }).then(listener => {
    listeners.diagnosticLogs = listener;
  });
});

export const updateDiagnosticLog = (log: DiagnosticLog) => async (dispatch: React.Dispatch<any>) => {
  log.archived = !!log.archived;
  log.started = log.started || new Date();
  if (!log.id) {
    log.id = log.systemId + log.started.getTime();
  }
  createOrUpdateDiagnosticLog(log);
  dispatch(setDiagnosticLog(log));
};

export const archiveDiagnosticLog =(log: DiagnosticLog) => async (dispatch: React.Dispatch<any>) => {
  log.archived = true;
  createOrUpdateDiagnosticLog(log);
  dispatch(setDiagnosticLog(log));
  dispatch(setDiagnosticLogArchived(log));
};


export const setData = (data: Partial<DiagnosticState>) => ({
  type: 'set-diagnostic-data',
  data
} as const);

export const setSymptoms = (symptoms: Symptom[]) => ({
  type: 'set-symptoms',
  symptoms
} as const);

export const setSolutions = (solutions: Solution[]) => ({
  type: 'set-solutions',
  solutions
} as const);

export const setFacts = (facts: FactQuestion[]) => ({
  type: 'set-facts',
  facts
} as const);

export const setDiagnosticLog = (log: DiagnosticLog) => ({
  type: 'set-diagnostic-log',
  log
} as const);

export const setDiagnosticLogArchived = (log: DiagnosticLog) => ({
  type: 'set-diagnostic-log-archived',
  log
} as const);

export const setDiagnosticLogs = (logs: DiagnosticLogs) => ({
  type: 'set-diagnostic-logs',
  logs
} as const);

export const setEngine = (engine: Diagnostics) => ({
  type: 'set-engine',
  engine
} as const);

export const setAlmanac = (almanac: Almanac) => ({
  type: 'set-almanac',
  almanac
} as const);


export type DiagnosticActions =
  | ActionType<typeof setData>
  | ActionType<typeof setSymptoms>
  | ActionType<typeof setSolutions>
  | ActionType<typeof setFacts>
  | ActionType<typeof setDiagnosticLogs>
  | ActionType<typeof setDiagnosticLog>
  | ActionType<typeof setDiagnosticLogArchived>
  | ActionType<typeof setEngine>
  | ActionType<typeof setAlmanac>
