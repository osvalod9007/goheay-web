export class ImageFile {
  id;
  name;
  pathUrl;
  publicUrl;
  mimeType;
  size;

  constructor(item: Partial<ImageFile> = {}) {
    const {id, name, pathUrl, publicUrl, mimeType, size} = item;
    this.id = id || undefined;
    this.name = name || '';
    this.pathUrl = pathUrl || '';
    this.publicUrl = publicUrl || '';
    this.mimeType = mimeType || '';
    this.size = size || '';
  }
}
