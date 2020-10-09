import {ImageFile} from './imageFile.cs';

export class VehicleType {
  id;
  type;
  image: ImageFile;
  measureMinDimension;
  measureMaxDimension;
  measureMinPayload;
  measureMaxPayload;
  constructor(item: Partial<VehicleType> = {}) {
    const {id, type, image, measureMinDimension, measureMaxDimension, measureMinPayload, measureMaxPayload} = item;
    this.id = id || undefined;
    this.type = type || '';
    this.image = image ? {...new ImageFile(image)} : new ImageFile();
    this.measureMinDimension = measureMinDimension ? measureMinDimension.amount : '';
    this.measureMaxDimension = measureMaxDimension ? measureMaxDimension.amount : '';
    this.measureMinPayload = measureMinPayload ? measureMinPayload.amount : '';
    this.measureMaxPayload = measureMaxPayload ? measureMaxPayload.amount : '';
  }
}
