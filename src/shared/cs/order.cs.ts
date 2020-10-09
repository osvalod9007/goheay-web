import {ImageFile} from './imageFile.cs';

/**
 * Order class
 */
export class Order {
  id;
  name;
  receiptNo;
  totalPieces;
  totalSmallSize;
  totalMediumSize;
  totalLargeSize;
  totalHugeSize;
  totalWeight;
  totalCubicDimension;
  note;
  pickUpContactName;
  pickUpContactMobileNumberCode;
  pickUpContactMobileNumber;
  dropOffContactName;
  dropOffContactMobileNumberCode;
  dropOffContactMobileNumber;
  products;
  customerId;
  customerFullName;
  customerEmail;
  customerMobilePhoneNumberCode;
  customerMobilePhoneNumber;
  customerImage: ImageFile;
  pickUpLocationAddress;
  pickUpGooglePlaceId;
  pickUpLocationPoint;
  pickUpTimeZone;
  dropOffLocationAddress;
  dropOffGooglePlaceId;
  dropOffLocationPoint;
  dropOffTimeZone;
  deliveryStartAt;
  deliveryEndAt;
  createdAt;
  status;
  vehicleType;
  driverFullName;
  driverEmail;
  driver;
  route;
  fare;
  measureBaseFarePrice;
  measureDistanceChargePrice;
  measureLaborChargePrice;
  measureServiceFeePrice;
  measureEveningDeliveryPrice;
  measureTaxPrice;
  measureHandlingSurchargesTotalPiecesPrice;
  measureTotalPrice;

  constructor(item: Partial<Order> = {}) {
    const {
      id,
      name,
      receiptNo,
      totalPieces,
      totalSmallSize,
      totalMediumSize,
      totalLargeSize,
      totalHugeSize,
      totalWeight,
      totalCubicDimension,
      note,
      pickUpContactName,
      pickUpContactMobileNumberCode,
      pickUpContactMobileNumber,
      dropOffContactName,
      dropOffContactMobileNumberCode,
      dropOffContactMobileNumber,
      products,
      customerId,
      customerFullName,
      customerEmail,
      customerMobilePhoneNumberCode,
      customerMobilePhoneNumber,
      customerImage,
      pickUpLocationAddress,
      pickUpGooglePlaceId,
      pickUpLocationPoint,
      pickUpTimeZone,
      dropOffLocationAddress,
      dropOffGooglePlaceId,
      dropOffLocationPoint,
      dropOffTimeZone,
      deliveryStartAt,
      deliveryEndAt,
      createdAt,
      status,
      vehicleType,
      driverFullName,
      driverEmail,
      driver,
      route,
      fare,
    } = item;
    this.id = id || undefined;
    this.name = name || '';
    this.receiptNo = receiptNo || '';
    this.totalPieces = totalPieces || 0;
    this.totalSmallSize = totalSmallSize || 0;
    this.totalMediumSize = totalMediumSize || 0;
    this.totalLargeSize = totalLargeSize || 0;
    this.totalHugeSize = totalHugeSize || 0;
    this.totalWeight = totalWeight ? totalWeight.amount : 0;
    this.totalCubicDimension = totalCubicDimension ? totalCubicDimension.amount : 0;
    this.note = note || '';
    this.pickUpContactName = pickUpContactName || '';
    this.pickUpContactMobileNumberCode = pickUpContactMobileNumberCode || '';
    this.pickUpContactMobileNumber = pickUpContactMobileNumber || '';
    this.dropOffContactName = dropOffContactName || '';
    this.dropOffContactMobileNumberCode = dropOffContactMobileNumberCode || '';
    this.dropOffContactMobileNumber = dropOffContactMobileNumber || '';
    this.products = products || [];
    this.customerId = customerId || '';
    this.customerFullName = customerFullName || '';
    this.customerEmail = customerEmail || '';
    this.customerMobilePhoneNumberCode = customerMobilePhoneNumberCode || '';
    this.customerMobilePhoneNumber = customerMobilePhoneNumber || '';
    this.customerImage = customerImage ? {...new ImageFile(customerImage)} : new ImageFile();
    this.pickUpLocationAddress = pickUpLocationAddress || '';
    this.pickUpGooglePlaceId = pickUpGooglePlaceId || '';
    this.pickUpLocationPoint = pickUpLocationPoint || '';
    this.pickUpTimeZone = pickUpTimeZone || '';
    this.dropOffLocationAddress = dropOffLocationAddress || '';
    this.dropOffGooglePlaceId = dropOffGooglePlaceId || '';
    this.dropOffLocationPoint = dropOffLocationPoint || '';
    this.dropOffTimeZone = dropOffTimeZone || '';
    this.deliveryStartAt = deliveryStartAt || '';
    this.deliveryEndAt = deliveryEndAt || '';
    this.createdAt = createdAt || '';
    this.status = status || '';
    this.vehicleType = vehicleType || '';
    this.driverFullName = driverFullName || '';
    this.driverEmail = driverEmail || '';
    this.driver = driver || '';
    this.route = route ? route : '';
    this.measureBaseFarePrice = fare && fare.measureBaseFarePrice ? fare.measureBaseFarePrice.amount : '-';
    this.measureDistanceChargePrice =
      fare && fare.measureDistanceChargePrice ? fare.measureDistanceChargePrice.amount : '-';
    this.measureLaborChargePrice = fare && fare.measureLaborChargePrice ? fare.measureLaborChargePrice.amount : '-';
    this.measureServiceFeePrice = fare && fare.measureServiceFeePrice ? fare.measureServiceFeePrice.amount : '-';
    this.measureEveningDeliveryPrice =
      fare && fare.measureEveningDeliveryPrice ? fare.measureEveningDeliveryPrice.amount : '-';
    this.measureTaxPrice = fare && fare.measureTaxPrice ? fare.measureTaxPrice.amount : '-';
    this.measureHandlingSurchargesTotalPiecesPrice =
      fare && fare.measureHandlingSurchargesTotalPiecesPrice
        ? fare.measureHandlingSurchargesTotalPiecesPrice.amount
        : '-';
    this.measureTotalPrice = fare && fare.measureTotalPrice ? fare.measureTotalPrice.amount : '-';
  }
}
