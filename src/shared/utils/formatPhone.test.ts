import formatPhone from './formatPhone';
import {FormatPhoneTypeEnum} from '../enums/FormatPhoneType.enum';

describe('Test Phone Formats methods', () => {
  it('Test call conformValue method with separator (-)', () => {
    expect(formatPhone.conformValue('1234567891', '123', '456', '7891', '-')).toBe('123-456-7891');
  });

  it('Test call conformValue method with separator (SPACE)', () => {
    expect(formatPhone.conformValue('1234567891', '123', '456', '7891', ' ')).toBe('123 456 7891');
  });

  it('Test call conformValue method with values empty', () => {
    expect(formatPhone.conformValue('', '', '', '', '')).toBe('');
  });

  it('Test call formatNational method', () => {
    expect(formatPhone.formatNational('1234567891', '123', '456', '7891')).toBe('(123) 456 - 7891');
  });

  it('Test call formatNational method with values empty', () => {
    expect(formatPhone.formatNational('', '', '', '')).toBe('');
  });

  it('Test call formatInternational method with isList true', () => {
    expect(formatPhone.formatInternational('1234567891', '123', '456', '7891', true, '1')).toBe('+1 123 456 7891');
  });

  it('Test call formatInternational method with isList false', () => {
    expect(formatPhone.formatInternational('1234567891', '123', '456', '7891', false, '1')).toBe('123 456 7891');
  });

  it('Test call formatInternational method with values empty', () => {
    expect(formatPhone.formatInternational('', '', '', '', false, '1')).toBe('');
  });

  it('Test call formatRFC method with isList true', () => {
    expect(formatPhone.formatRFC('1234567891', true, '1')).toBe('+11234567891');
  });

  it('Test call formatRFC method with isList false', () => {
    expect(formatPhone.formatRFC('1234567891', false, '1')).toBe('1234567891');
  });

  it('Test call formatRFC method with values empty', () => {
    expect(formatPhone.formatRFC('', false, '1')).toBe('');
  });

  it('Test call formatLocal method', () => {
    expect(formatPhone.formatLocal('1234567', '123', '4567')).toBe('123 4567');
  });

  it('Test call formatDialedUS method with isList true', () => {
    expect(formatPhone.formatDialedUS('1234567891', '123', '456', '7891', true, '1')).toBe('1-123-456-7891');
  });

  it('Test call formatDialedUS method with isList false', () => {
    expect(formatPhone.formatDialedUS('1234567891', '123', '456', '7891', false, '1')).toBe('123-456-7891');
  });

  it('Test call formatDialedUS method with values empty', () => {
    expect(formatPhone.formatDialedUS('', '', '', '', true, '')).toBe('-');
  });

  it('Test call formatsGeneral method with typeFormat National', () => {
    expect(formatPhone.formatsGeneral('1234567891', true, '1', FormatPhoneTypeEnum.NATIONAL)).toBe('(123) 456 - 7891');
  });

  it('Test call formatsGeneral method with isList true and typeFormat International', () => {
    expect(formatPhone.formatsGeneral('1234567891', true, '1', FormatPhoneTypeEnum.INTERNATIONAL)).toBe(
      '+1 123 456 7891',
    );
  });

  it('Test call formatsGeneral method with isList false and typeFormat International', () => {
    expect(formatPhone.formatsGeneral('1234567891', false, '1', FormatPhoneTypeEnum.INTERNATIONAL)).toBe(
      '123 456 7891',
    );
  });

  it('Test call formatsGeneral method with isList true and typeFormat RFC', () => {
    expect(formatPhone.formatsGeneral('1234567891', true, '1', FormatPhoneTypeEnum.RFC)).toBe('+11234567891');
  });

  it('Test call formatsGeneral method with isList false and typeFormat RFC', () => {
    expect(formatPhone.formatsGeneral('1234567891', false, '1', FormatPhoneTypeEnum.RFC)).toBe('1234567891');
  });

  it('Test call formatsGeneral method with typeFormat Local', () => {
    expect(formatPhone.formatsGeneral('1234567', true, '1', FormatPhoneTypeEnum.LOCAL)).toBe('123 4567');
  });

  it('Test call formatsGeneral method with isList true and typeFormat Dialect US', () => {
    expect(formatPhone.formatsGeneral('1234567891', true, '1', FormatPhoneTypeEnum.DIALECT_US)).toBe('1-123-456-7891');
  });

  it('Test call formatsGeneral method with isList false and typeFormat Dialect US', () => {
    expect(formatPhone.formatsGeneral('1234567891', false, '1', FormatPhoneTypeEnum.DIALECT_US)).toBe('123-456-7891');
  });

  it('Test call formatsGeneral method with values empty', () => {
    expect(formatPhone.formatsGeneral('', false, '1', FormatPhoneTypeEnum.NATIONAL)).toBe('');
  });

  it('Test call formatToString method', () => {
    expect(formatPhone.formatToString('1234567891')).toBe('1234567891');
  });

  it('Test call formatToString method with value empty', () => {
    expect(formatPhone.formatToString('')).toBe('');
  });
});
