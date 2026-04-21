import ImageKit, { toFile } from "@imagekit/nodejs";

export class ImageKitConfig extends ImageKit {
  constructor(privatekey: string) {
    super({
      privateKey: privatekey,
    });
  }
  private async bufferFile(f: File) {
    try {
      const buffer = await f.arrayBuffer();
      const raw_buffer = Buffer.from(buffer);
      return raw_buffer;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  public async uploadImage(file: File, filename: string) {
    try {
      const buffer = await this.bufferFile(file);
      const response = await this.files.upload({
        file: await toFile(buffer),
        fileName: filename,
      });
      return response.url;
    } catch (error) {
      throw new Error(String(error));
    }
  }
}
