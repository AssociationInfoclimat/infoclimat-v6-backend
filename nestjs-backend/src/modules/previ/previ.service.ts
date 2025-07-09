import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { IcLegacyApiClientService } from '../ic-legacy-api/ic-legacy-api-client.service';

@Injectable()
export class PreviService {
  private readonly logger = new FunctionLogger(PreviService.name);
  constructor(
    private readonly icLegacyApiClientService: IcLegacyApiClientService,
  ) {}

  async getTicket(body: { lat?: number; lon?: number; accuracy?: number }) {
    try {
      return await this.icLegacyApiClientService.getWeatherApiTicket(body);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  async getForecast(body: { data: string; entropy: string }) {
    try {
      return await this.icLegacyApiClientService.getWeatherApiForecast(body);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  async getCommonRegionsDepts() {
    try {
      // TODO: Get the db/table data using a repo to v5_prevs db
      /*
         <?php   
            $previsionniste_statement = get_last_17_previsionnistes();
            ?>
            <?php while ($previsionniste = $previsionniste_statement->fetch(PDO::FETCH_ASSOC)) : ?>
                <a class="pchref tipsy-trigger" href="<?= get_previsionniste_url($previsionniste) ?>" title="Mis à jour le <?= date('d/m/Y, H\hi', strtotime($previsionniste['last_prev'])) ?>">
                    <?= convert_to_html_entities($previsionniste['zone'], 'UTF-8') ?>
                </a>
            <?php endwhile ?>
            */
      /*

        function get_last_17_previsionnistes(): PDOStatement
        {

            return get_executed_select_statement(
                'V5_prevs',
                <<<SQL
                    SELECT
                        id,
                        zone,
                        last_prev
                    FROM V5_prevs.previsionnistes
                    ORDER BY last_prev DESC
                    LIMIT 17
                SQL
            );
        }
        function get_previsionniste_url(array $previsionniste): string
        {
            $previsionniste_slug = get_slug($previsionniste['zone']);
            return "/previsions-regionales-meteo-{$previsionniste['id']}-{$previsionniste_slug}.html";
        }
    */
      const previsionnistes = [
        {
          id: 4,
          label: 'Bretagne',
          updatedAt: '2025-07-08 02:57:00',
          url: '/previsions-regionales-meteo-4-bretagne.html',
        },
        {
          id: 8,
          label: 'Gironde',
          updatedAt: '2025-07-08 02:57:00',
          url: '/previsions-regionales-meteo-8-gironde.html',
        },
      ];
      return previsionnistes;
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
