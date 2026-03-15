import { IsArray, IsNumber, IsString } from 'class-validator';
import { MobileNews } from './chroniques.types';

export class GetMobileNewsDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  thumbnail: string | null;

  @IsString()
  type: 'bqs' | 'bim';

  @IsString()
  publishedAt: string;

  @IsString()
  summary: string;

  @IsString()
  url: string;

  static toDto(news: MobileNews): GetMobileNewsDto {
    return {
      id: news.id,
      title: news.title,
      content: news.content,
      thumbnail: news.thumbnail,
      type: news.type,
      publishedAt: news.publishedAt,
      summary: news.summary,
      url: news.url,
    };
  }
}

type ChroniqueNewsDtoSource = {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  summary: string;
  url: string;
};

export class GetBqsNewsDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  publishedAt: string;

  @IsString()
  summary: string;

  @IsString()
  url: string;

  static toDto(news: ChroniqueNewsDtoSource): GetBqsNewsDto {
    return {
      id: news.id,
      title: news.title,
      content: news.content,
      publishedAt: news.publishedAt,
      summary: news.summary,
      url: news.url,
    };
  }
}

export class GetBimNewsDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  publishedAt: string;

  @IsString()
  summary: string;

  @IsString()
  url: string;

  static toDto(news: ChroniqueNewsDtoSource): GetBimNewsDto {
    return {
      id: news.id,
      title: news.title,
      content: news.content,
      publishedAt: news.publishedAt,
      summary: news.summary,
      url: news.url,
    };
  }
}

type Bs2sDtoSource = {
  link: string;
  dateRange: string;
  types: string[];
};

export class GetBs2sDto {
  @IsString()
  link: string;

  @IsString()
  dateRange: string;

  @IsArray()
  @IsString({ each: true })
  types: string[];

  static toDto(item: Bs2sDtoSource): GetBs2sDto {
    return {
      link: item.link,
      dateRange: item.dateRange,
      types: item.types,
    };
  }
}
