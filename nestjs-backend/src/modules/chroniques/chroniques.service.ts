import { Injectable } from '@nestjs/common';
import { ChroniquesRepository } from './chroniques.repository';
import dayjs from 'dayjs';
import { FunctionLogger, stripTags, strToUrl } from 'src/shared/utils';
import { ChroniquesType, Types } from './chroniques.types';

@Injectable()
export class ChroniquesService {
  private readonly logger = new FunctionLogger(ChroniquesService.name);
  constructor(private readonly repository: ChroniquesRepository) {}

  // bqs : FROM V5_chroniques.actualites WHERE `type` = 'bqs'
  async getBqsNews({ limit = 4 }: { limit?: number }) {
    try {
      const chroniques = await this.repository.getBqsNews({ limit });
      return chroniques.map((chronique) => ({
        ...chronique,
        publishedAt: dayjs(chronique.publishedAt).format('DD/MM'),
        summary: stripTags(chronique.content).slice(0, 80) + '...',
        url: `/actualites/bqs/${chronique.id}/${strToUrl(chronique.title)}.html`,
      }));
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  // bqs : FROM V5_chroniques.actualites WHERE `type` = 'bim' AND indice_importance <> -1
  async getBimNews({ limit = 5 }: { limit?: number }) {
    try {
      const chroniques = await this.repository.getBimNews({ limit });
      return chroniques.map((chronique) => ({
        ...chronique,
        publishedAt: dayjs(chronique.publishedAt).format('DD/MM'),
        summary: stripTags(chronique.content).slice(0, 100) + '...',
        url: `/actualites/bim/${chronique.id}/${strToUrl(chronique.title)}.html`,
      }));
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  async getBs2s() {
    try {
      const bulletinsSpeciaux = await this.repository.getSpecialBulletins({
        limit: 4,
      });
      const suiviSpecial = await this.repository.getSuiviSpecial({ limit: 4 });

      // We just gonna merge bulletins speciaux and suivi special:

      const mergedBs25 = [
        ...bulletinsSpeciaux.map((item) => ({
          ...item,
          type: ChroniquesType.BulletinSpecial,
          title: item.summaryTitle,
          startedAt: dayjs(item.createdAt),
          endedAt: dayjs(item.closedAt),
        })),
        ...suiviSpecial.map((item) => ({
          ...item,
          type: ChroniquesType.SuiviSpecial,
          title: '',
          startedAt: dayjs(item.startedAt),
          endedAt: dayjs(item.endedAt),
        })),
      ].sort((a, b) => b.endedAt.diff(a.endedAt));

      const results: { link: string; dateRange: string; types: string[] }[] =
        [];

      let i = 0;
      for (const item of mergedBs25) {
        if (i > 4) {
          break;
        }
        const startedAtDay = item.startedAt.format('DD');
        const startedAtMonth = item.startedAt.format('MM');
        const endedAtDay = item.endedAt.format('DD');
        const endedAtMonth = item.endedAt.format('MM');
        let dateRangeAsText = '';
        if (startedAtDay == endedAtDay && startedAtMonth == endedAtMonth) {
          dateRangeAsText = `le ${endedAtDay}/${endedAtMonth}`;
        } else {
          if (startedAtMonth == endedAtMonth) {
            dateRangeAsText = `du ${startedAtDay} au ${endedAtDay}/${endedAtMonth}`;
          } else {
            dateRangeAsText = `du ${startedAtDay}/${startedAtMonth} au ${endedAtDay}/${endedAtMonth}`;
          }
        }
        const link =
          item.type === ChroniquesType.SuiviSpecial
            ? `/suivi-special-${item.id}.html`
            : `/bulletin-special-${item.id}-${strToUrl(item.title)}.html`;

        results.push({
          link,
          dateRange: dateRangeAsText,
          types: [...new Set(item.types.map((type) => type.toLowerCase()))],
        });

        i++;
      }
      return results;
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
