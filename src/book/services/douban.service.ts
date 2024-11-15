import * as cheerio from 'cheerio';
import * as randUserAgent from 'rand-user-agent';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import OssService from 'src/shared/services/oss.service';

const FIELD_MAP = {
  '作者:': 'author',
  '译者:': 'translator',
  '出版社:': 'publisher',
  '出版年:': 'published',
};

@Injectable()
export class DoubanService {
  constructor(
    private readonly httpService: HttpService,
    private ossService: OssService,
  ) {}
  private logger = new Logger(DoubanService.name);

  private async crackPageContent(url: string, cookie?: string) {
    this.logger.log(`抓取页面地址： ${url}`);
    try {
      const { data } = await this.httpService.axiosRef.get(url, {
        responseType: 'text',
        headers: {
          'User-Agent': randUserAgent('desktop', 'chrome', 'linux'),
          cookie,
        },
      });
      return data;
    } catch (error) {
      this.logger.log(`页面抓取失败： ${error?.message}`);
    }
    return '';
  }

  private getDetailUrlByWindowData(content: string) {
    const match = content.match(/window\.__DATA__ = (\{.*?\});/);
    try {
      const result = JSON.parse(match[1]);
      return result?.items?.find((i) => !!i.url)?.url;
    } catch (error) {}
    return '';
  }

  async query(isbn: string, cookie?: string) {
    const searchPageContent = await this.crackPageContent(
      `https://search.douban.com/book/subject_search?search_text=${isbn}&cat=1001`,
      cookie,
    );
    if (!searchPageContent.includes('window.__DATA__')) {
      throw new BadRequestException('未找到 window.__DATA__ 数据');
    }

    const detailUrl = this.getDetailUrlByWindowData(searchPageContent);
    if (!detailUrl) {
      throw new BadRequestException('未找到详情地址');
    }

    const detailPageContent = await this.crackPageContent(detailUrl, cookie);
    const $ = cheerio.load(detailPageContent);
    const data = $('#info')
      .text()
      .replace(/\n/g, '')
      .split(' ')
      .filter(Boolean);

    const info = {};
    data.reduce((key, value) => {
      if (Object.keys(FIELD_MAP).includes(value)) return FIELD_MAP[value];
      if (value.includes(':')) return '';
      if (key) {
        info[key] = (info[key] || '') + value;
      }
      return key;
    }, '');

    return {
      isbn,
      title: $('h1 > span').text().trim(),
      cover: $('#mainpic > a').attr('href').trim(),
      ...info,
    };
  }
}
