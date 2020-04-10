import { CloudinaryUploadResult } from './CloudinaryUploadResult';
export interface Photo {
  name: string,
  description: string,
  data: CloudinaryUploadResult,
  createdate: Date,
  lastupdate: Date,
  createdby: string,
  updatedby: string
}
