import {BasicProfile} from './basicProfile.cs';
import {ImageFile} from './imageFile.cs';
export class DocumentDriver {
  id;
  type;
  status;
  uploadFile: ImageFile;

  constructor(item: Partial<DocumentDriver> = {}) {
    const {id, type, status, uploadFile} = item;

    this.id = id || undefined;
    this.type = type || '';
    this.status = status || '';
    this.uploadFile = uploadFile ? {...new ImageFile(uploadFile)} : new ImageFile();
  }
}
