import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as OSS from 'ali-oss';

@Injectable()
export default class OssService {
  private client: OSS;
  constructor(private readonly httpService: HttpService) {
    this.client = new OSS({
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      region: process.env.OSS_REGION,
      bucket: process.env.OSS_BUCKET,
      authorizationV4: true,
    });
  }

  async upload(name: string, buffer: Buffer, dir?: string) {
    try {
      const result = await this.client.put(
        `${dir || process.env.OSS_DIR}/${name}`,
        buffer,
      );
      return result.name;
    } catch (e) {
      console.log(e);
    }
    return '';
  }

  async uploadByUrl(url: string, isbn: string) {
    const ext = url.split('.').pop();
    const res = await this.httpService.axiosRef.get(url, {
      responseType: 'arraybuffer',
    });
    if (!res.data) {
      return '';
    }
    return this.upload(`${isbn}.${ext}`, res.data);
  }
}
