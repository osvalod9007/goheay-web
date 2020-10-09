import {createContext} from 'react';
import {decorate, observable, action} from 'mobx';

export class DocumentsStore {
  parentId: string;
  parentType: boolean;
  documentId: string;
  documentStatus: string;
  statusSelected: string;
  url: string;
  isUpdateList: boolean;
  isOpenModalUpdate: boolean;
  isOpenModalView: boolean;

  constructor() {
    this.parentId = '';
    this.parentType = true;
    this.documentId = '';
    this.documentStatus = '';
    this.statusSelected = '';
    this.url = '';
    this.isUpdateList = false;
    this.isOpenModalUpdate = false;
    this.isOpenModalView = false;
  }

  setParentId(parentId: string) {
    this.parentId = parentId;
  }

  setParentType(parentType: boolean) {
    this.parentType = parentType;
  }

  setDocumentId(documentId: string) {
    this.documentId = documentId;
  }

  setDocumentStatus(status: string) {
    this.documentStatus = status;
  }
  setStatusSelected(statusSelected: string) {
    this.statusSelected = statusSelected;
  }

  setUrl(url: string) {
    this.url = url;
  }

  setIsUpdateList(update: boolean) {
    this.isUpdateList = update;
  }

  setIsOpenModalUpdateForm(isOpenModalUpdate: boolean) {
    this.isOpenModalUpdate = isOpenModalUpdate;
  }

  setIsOpenModalViewForm(isOpenModalView: boolean) {
    this.isOpenModalView = isOpenModalView;
  }
}

decorate(DocumentsStore, {
  parentId: observable,
  parentType: observable,
  documentId: observable,
  documentStatus: observable,
  statusSelected: observable,
  url: observable,
  isUpdateList: observable,
  isOpenModalUpdate: observable,
  isOpenModalView: observable,
  setParentId: action,
  setParentType: action,
  setDocumentId: action,
  setDocumentStatus: action,
  setStatusSelected: action,
  setUrl: action,
  setIsUpdateList: action,
  setIsOpenModalUpdateForm: action,
  setIsOpenModalViewForm: action,
});

export default createContext(new DocumentsStore());
