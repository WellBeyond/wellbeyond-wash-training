import {createSelector} from 'reselect';
import {AppState} from './state';
import {Lesson} from '../models/Training';
import queryString from 'query-string';
import i18n from '../i18n';
import {Organization} from "../models/User";
import { Form } from '../models/Form';
import { FormSessions } from './form/form.state';

export const getLoading  = (state: AppState) => {
  return !!state.data.loading;
}
export const getDarkMode  = (state: AppState) => {
  return state.user.darkMode;
}
export const getIntercomUser  = (state: AppState) => {
  return state.user.intercomUser;
}
export const getTrainingSessions = (state: AppState) => {
  return state.user.sessions;
}
export const getSubjects = (state: AppState) => {
  return state.data.subjects;
}
export const getTopics = (state: AppState) => {
  return state.data.topics;
}
export const getLessons = (state: AppState) => {
  return state.data.lessons;
}
export const getOrganizations = (state: AppState) => {
  return state.user.organizations;
}
export const getSystems = (state: AppState) => {
  return state.maintenance.systems;
}
export const getSystemTypes = (state: AppState) => {
  return state.maintenance.systemTypes;
}
export const getChecklists = (state: AppState) => {
  return state.maintenance.checklists;
}
export const getMaintenanceLogs = (state: AppState) => {
  return state.maintenance.maintenanceLogs;
}
export const getSymptoms = (state: AppState) => {
  return state.diagnostic.symptoms;
}
export const getSolutions = (state: AppState) => {
  return state.diagnostic.solutions;
}
export const getDiagnostics = (state: AppState) => {
  return state.diagnostic.diagnostics;
}
export const getDiagnosticLogs = (state: AppState) => {
  return state.diagnostic.diagnosticLogs;
}
export const getDiagnosticEngine = (state: AppState) => {
  return state.diagnostic.engine;
}
export const getUserId = (state: AppState) => {
  return state.user.profile && state.user.profile.id;
}
export const getUserProfile = (state: AppState) => {
  return state.user.profile;
}
export const getUserOrganizationId = (state: AppState) => {
  return state.user.profile ? state.user.profile.organizationId : undefined;
}
export const getUserCommunity = (state: AppState) => {
  return state.user.profile ? state.user.profile.community : undefined;
}
export const getIsAdmin = (state: AppState) => {
  return state.user.isAdmin;
}
const getSubjectIdParam = (_state: AppState, props: any) => {
  return props.match.params['subjectId'];
}
const getTopicIdParam = (_state: AppState, props: any) => {
  const values = queryString.parse(props.location.search);
  return values['topicId'];
}
const getLessonIdParam = (_state: AppState, props: any) => {
  return props.match.params['lessonId'];
}
const getPageIdParam = (_state: AppState, props: any) => {
  return props.match.params['pageId'];
}
const getQuestionIdParam = (_state: AppState, props: any) => {
  return props.match?.params?.questionId;
}
const getTrainingSessionIdParam  = (_state: AppState, props: any) => {
  const values = queryString.parse(props.location.search);
  return values['tsId'];
}
const getSystemIdParam = (_state: AppState, props: any) => {
  return props.match.params['systemId'];
}
const getMaintenanceLogIdParam = (_state: AppState, props: any) => {
  return props.match.params['mlId'];
}
const getDiagnosticLogIdParam = (_state: AppState, props: any) => {
  return props.match.params['dlId'];
}
const getStepIdParam = (_state: AppState, props: any) => {
  return props.match.params['stepId'];
}
export const getUserOrganization = createSelector(
  getOrganizations, getUserOrganizationId, getIsAdmin,
  (organizations, organizationId, isAdmin) => {
    if (isAdmin) {
      return {id: '', name: 'Administrator', contactName: 'System Administrator', contactEmail: 'admin@wellbeyondwater.com', communities:[]} as Organization
    }
    if (organizations) {
      if (organizationId) {
        return organizations.find((o) => o.id === organizationId)
      }
    }
  }
);
export const getSubjectsForOrganization = createSelector(
  getSubjects, getUserId, getUserOrganizationId,
  (subjects, userId, organizationId) => {
    if (subjects) {
      if (organizationId) {
        return subjects.filter((s) => {
          return s.organizationId === organizationId ||
            (s.organizations && s.organizations.includes(organizationId));

        })
      }
      else if (userId) {
        return subjects;
      }
    }
    return [];
  }
);
export const getFormSessions = (state: AppState) => {
  return state.user.formSessions;
}
export const getFormTypes = (state: AppState) => {
  return state.form.formTypes;
}
export const getForms = (state: AppState) => {
  return state.form.forms;
}
const getFormTypeIdParam = (_state: AppState, props: any) => {
  return props.match?.params?.formTypeId
}
const getFormIdParam = (_state: AppState, props: any) => {
  return props.match?.params?.formId;
}
const getFormSessionIdParam  = (_state: AppState, props: any) => {
  const values: { fsId?: string } = queryString.parse(props.location?.search);
  return values?.['fsId'];
}

export const getFormsForOrganization = createSelector(
  getForms, getUserId, getUserOrganizationId, getIsAdmin,
  (forms, userId, organizationId, isAdmin) => {
    if (forms) {
      if (isAdmin) {
        return forms
      }
      if (organizationId) {
        return forms.filter((s: Form) => s ? s.organizationId?.includes(organizationId) : [])
      }
      else if (userId) {
        return forms;
      }
    }
    return [];
  }
);
export const getSubjectsForTopic = createSelector(
  getSubjectsForOrganization, getTopicIdParam,
  (subjects, id) => {
    if (subjects) {
      return id ? subjects.filter(s => id === s.topicId) : subjects;
    }
    return [];
  }
);
export const getTopicsForOrganization = createSelector(
  getTopics, getSubjectsForOrganization,
  (topics, subjects) => {
    if (topics && subjects) {
      return topics.filter((t) => {
        return subjects.find((s) => t.id === s.topicId);
      });
    }
    return [];
  }
);
export const getFormTypesForOrganization = createSelector(
  getFormTypes, getFormsForOrganization,
  (formTypes, forms) => {
    if (formTypes && forms) {
      return formTypes.filter((t) => {
        return forms.find((s) => t.id === s.id);
      });
    }
    return [];
  }
);
export const getSystemsForOrganization = createSelector(
  getSystems, getUserId, getUserOrganizationId, getIsAdmin,
  (systems, userId, organizationId, isAdmin) => {
    if (systems) {
      if (isAdmin) {
        return systems;
      }
      if (organizationId) {
        return systems.filter((s) => s.organizationId === organizationId)
      }
      else if (userId) {
        return systems;
      }
    }
    return [];
  }
);
export const getSystemsForCommunity = createSelector(
  getSystemsForOrganization, getUserId, getUserCommunity, getIsAdmin,
  (systems, userId, community, isAdmin) => {
    if (systems) {
      if (isAdmin) {
        return systems;
      }
      if (community) {
        return systems.filter((s) => s.community === community || !s.community)
      }
      else if (userId) {
        return systems;
      }
    }
    return [];
  }
);
export const getTrainingSession = createSelector(
  getTrainingSessions, getTrainingSessionIdParam,
  (sessions, id) => {
    if (sessions && id && typeof id === 'string') {
      return sessions[id];
    }
  }
);
export const getFormSession = createSelector(
  getFormSessions, getFormSessionIdParam,
  (formSessions: FormSessions | undefined, id: string | undefined) => {
    if (formSessions && id && typeof id === 'string') {
      return formSessions?.[id];
    }
  }
);
export const getSubject = createSelector(
  getSubjects, getSubjectIdParam,
  (subjects, id) => {
    if (subjects && id) {
      const subject = subjects.find(s => s.id === id);
      if (subject) {
        i18n.changeLanguage(subject.locale || 'en');
      }
      return subject;
    }
  }
);
export const getTopic = createSelector(
  getTopics, getTopicIdParam,
  (topics, id) => {
    if (topics && id) {
      const topic = topics.find(s => s.id === id);
      return topic;
    }
  }
);
export const getFormType = createSelector(
  getFormTypes, getFormTypeIdParam,
  (formTypes, id) => {
    if (formTypes && id) {
      let formTypeId = id.split('=')?.[1] || id
      const formType = formTypes.find(s => s.id === formTypeId);
      return formType;
    }
  }
);
export const getForm = createSelector(
  getForms, getFormIdParam,
  (forms, id) => {
    if (forms && id) {
      const form = forms.find(s => s.id === id);
      return form;
    }
  }
);
export const getLesson = createSelector(
  getLessons, getLessonIdParam,
  (lessons, id) => {
    return lessons.find(l => l.id === id);
  }
);
export const getLessonPage = createSelector(
  getLesson, getPageIdParam,
  (lesson, id) => {
    const idx = parseInt(id) - 1;
    return lesson && lesson.pages && lesson.pages.length > idx ? lesson.pages[idx] : undefined;
  }
);
export const getQuestion = createSelector(
  getLesson, getQuestionIdParam,
  (lesson, id) => {
    const idx = parseInt(id) - 1;
    return lesson && lesson.questions && lesson.questions.length > idx ? lesson.questions[idx] : undefined;
  }
);

export const getFormQuestion = createSelector(
  getLesson, getQuestionIdParam,
  (form, id) => {
    const idx = parseInt(id) - 1;
    return form?.questions?.[idx];
  }
);

export const getPageIdx = createSelector(
  getLesson, getPageIdParam,
  (lesson, id) => {
    const idx = parseInt(id) - 1;
    return lesson && lesson.pages && lesson.pages.length > idx ? idx : -1;
  }
);

export const getQuestionIdx = createSelector(
  getLesson, getQuestionIdParam,
  (lesson, id) => {
    const idx = parseInt(id) - 1;
    return lesson && lesson.questions && lesson.questions.length > idx ? idx : -1;
  }
);

export const getFormQuestionIdx = createSelector(
  getForm, getQuestionIdParam,
  (form, id) => {
    const idx = parseInt(id) - 1;
    return form?.questions?.length && form.questions.length > idx ? idx : -1;
  }
);

export const getLessonProgress = createSelector(
  getTrainingSession, getLessonIdParam, getUserId,
  (activeSession, id, userId) => {
    if (activeSession && id) {
      return (activeSession && activeSession.lessons &&  activeSession.lessons[id]) || {id: id, lessonId: id, answers: []}
    }
  }
);

export const getFormProgress = createSelector(
  getFormSession, getQuestionIdParam, getUserId,
  (activeSession, id, userId) => {
    if (activeSession && id) {
      return activeSession?.questions?.[id] || {id: id, questionId: id, answers: []}
    }
  }
);

export const getSubjectLessons = createSelector(
  getSubject, getLessons,
  (subject, lessons) => {
    const subjectLessons = Array<Lesson>();
    subject && subject.lessons.forEach(sl => {
      const lesson = lessons.find(l => l.id === sl.lessonId);
      lesson && subjectLessons.push(lesson);
    });
    return subjectLessons;
  }
);

export const getMaintenanceLog = createSelector(
  getMaintenanceLogs, getMaintenanceLogIdParam,
  (logs, id) => {
    if (logs && id && typeof id === 'string') {
      return logs[id];
    }
  }
);

export const getDiagnosticLog = createSelector(
  getDiagnosticLogs, getDiagnosticLogIdParam,
  (logs, id) => {
    if (logs && id && typeof id === 'string') {
      return logs[id];
    }
  }
);

export const getSystem = createSelector(
  getSystems, getSystemIdParam,
  (systems, id) => {
    return systems.find(l => l.id === id);
  }
);

export const getChecklistsForSystem = createSelector(
  getChecklists, getSystem,
  (checklists, system) => {
    if (checklists && system) {
      return checklists.filter((c) => {
        return !c.systemTypeId ||                                                                 // applies to all system types
          c.systemTypeId === system.systemTypeId ||                                               // system has a single type
          (system.systemTypeIds && system.systemTypeIds.find((t) => t === c.systemTypeId)); // system has multiple types
      });
    }
    return [];
  }
);

export const getSymptomsForSystem = createSelector(
  getSymptoms, getSystem,
  (symptoms, system) => {
    if (symptoms && system) {
      return symptoms.filter((s) => {
        //@ts-ignore
        if (s.hidden) {
          return false;
        }
        if (!s.systemTypeIds  || !s.systemTypeIds.length) {
          return true;
        }
        if (!system.systemTypeIds  || !system.systemTypeIds.length) {
          return false;
        }
        let contains:boolean = false;
        system.systemTypeIds.forEach(val => {
          if (s.systemTypeIds && s.systemTypeIds.includes(val)) contains = true;
        });
        return contains;
      });
    }
    return [];
  }
);

export const getSymptomsForDiagnosis = createSelector(
  getSymptoms, getDiagnosticLog,
  (symptoms, log) => {
    if (symptoms && log && log.symptoms) {
      return symptoms.filter((s) => {
        // @ts-ignore
        return log.symptoms.indexOf(s.id) > -1;
      });
    }
    return [];
  }
);

export const getChecklistForLog = createSelector(
  getChecklists, getMaintenanceLog,
  (checklists, log) => {
    if (checklists && log) {
      return checklists.find((c) => c.id === log.checklistId);
    }
  }
);

export const getSystemForLog = createSelector(
  getSystems, getMaintenanceLog,
  (systems, log) => {
    if (systems && log) {
      return systems.find((s) => s.id === log.systemId);
    }
    return [];
  }
);

export const getSystemForDiagnostic = createSelector(
  getSystems, getDiagnosticLog,
  (systems, log) => {
    if (systems && log) {
      return systems.find((s) => s.id === log.systemId);
    }
    return [];
  }
);

export const getChecklistStep = createSelector(
  getChecklistForLog, getStepIdParam,
  (checklist, idx) => {
    if (checklist && checklist.steps && checklist.steps.length > idx) {
      return checklist.steps[idx];
    }
  }
);

export const getMaintenanceStep = createSelector(
  getMaintenanceLog, getStepIdParam,
  (log, idx) => {
    if (log && log.steps && log.steps.length > idx) {
      return log.steps[idx];
    }
  }
);
