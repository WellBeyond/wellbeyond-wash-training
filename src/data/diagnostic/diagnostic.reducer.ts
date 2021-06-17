import {DiagnosticActions} from './diagnostic.actions';
import {DiagnosticLogs, DiagnosticState} from './diagnostic.state';

export const diagnosticReducer = (state: DiagnosticState, action: DiagnosticActions): DiagnosticState => {
  switch (action.type) {
    case 'set-diagnostic-data': {
      return {...state, ...action.data};
    }
    case 'set-symptoms': {
      return {...state, symptoms: action.symptoms};
    }
    case 'set-solutions': {
      return {...state, solutions: action.solutions};
    }
    case 'set-diagnostics': {
      return {...state, diagnostics: action.diagnostics};
    }
    case 'set-diagnostic-logs': {
      return {...state, diagnosticLogs: action.logs};
    }
    case 'set-diagnostic-engine': {
      return {...state, engine: action.engine};
    }
    case 'set-almanac': {
      return {...state, almanac: action.almanac};
    }
    case 'set-diagnostic-log': {
      let diagnosticLogs = Object.assign({}, state.diagnosticLogs);
      if (action.log.id) {
        diagnosticLogs[action.log.id] = action.log;
      }
      return { ...state, diagnosticLogs: diagnosticLogs };
    }
    case 'set-diagnostic-log-archived': {
      let diagnosticLogs = {...state.diagnosticLogs} as DiagnosticLogs;
      if (action.log.id) {
        delete diagnosticLogs[action.log.id];
      }
      return { ...state, diagnosticLogs: diagnosticLogs};
    }
  }
}
