import {DocumentTypeEnum} from '../enums/DocumentType.enum';
import {DocumentVehicleStatusEnum} from '../enums/DocumentVehicleStatus.enum';

export class VehicleDocuments {
  id;
  file;
  type: DocumentTypeEnum;
  status: DocumentVehicleStatusEnum;

  constructor(item: Partial<VehicleDocuments> = {}) {
    const {id, file, type, status} = item;
    this.id = id || undefined;
    this.file = file;
    this.type = type || DocumentTypeEnum.TYPE_VEHICLE_PHOTO;
    this.status = status || DocumentVehicleStatusEnum.STATUS_ASSESSING;
  }
}
