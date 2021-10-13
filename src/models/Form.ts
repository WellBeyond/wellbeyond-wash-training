import { MediaItem } from "./Maintenance";
import { Answer as FormAnswer} from "../data/form/form.state";

export enum FormQuestionType {
  Text = "text",
  OE= "open-ended",
  Number = "number",
  Radio = "radio",
  Checkbox = "checkbox",
  Photo = "photo",
  Video = "video",
  YesNo = "yes-no",
  Mcq = "choose-one",
  AI = "additional-info",
  Cm = "multi-select"
}

export interface FormQuestion {
  id?: string;
  questionType: FormQuestionType;
  questionText: string;
  questionDescription: string
  choices?: Array<{value: string}>;
  isRequired: boolean;
  photo?: string;
  helpText?: string;
  photoCaption?: string;
  questionAnswer?: string;
  answer: FormAnswer;
}

export interface Form {
  id: string
  organization?: string;
  organizationId?: string[];
  locale?: string;
  type: string;
  name: string;
  description: string;
  isPublished: boolean;
  questions: FormQuestion[];
  photos?: MediaItem[]; // Embedded list
  loading: boolean;
  formTypeId: string;
  pages?: [];
}

export interface FormType {
  locale: string;
  id?: string;
  name?: string;
  description?: string;
  photo?: string;
  formCategory?: string
}

export interface FormProgress {
  id?: string;
  formId: string;
  started?: Date;
  completed?: Date;
  preScore?: number;
  score?: number;
  answers: FormAnswer;
}

export interface FormProgressHash {
  [formId:string] : FormProgress
}

export interface FormSession {
  id?: string;
  name?: string;
  archived: boolean;
  userId: string;
  organizationId?: string;
  organization?: string;
  community?: string;
  formTypeId: string;
  started?: Date;
  completed?: Date;
  forms?: FormProgressHash;
  questions?: FormQuestion[];
}


export interface FormRecord {
  id: string;
  name: string;
  organizationId: string;
  formTypeId: string;
  checklistId: string;
  userId?: string;
  archived?: boolean;
  started?: Date;
  completed?: Date;
  stepCount?: number;
  organization?: string;
  community?: string;
  forms?: FormProgressHash;
  questions?: FormQuestion[];
}

