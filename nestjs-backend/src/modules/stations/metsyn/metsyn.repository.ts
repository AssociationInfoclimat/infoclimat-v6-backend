import { PrismaService } from 'src/database/prisma.service';
import { FunctionLogger } from 'src/shared/utils';

export class MetsynRepository {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new FunctionLogger(MetsynRepository.name);

  /*
    <<<SQL
    SELECT id_textuel 
    FROM metsyn
    WHERE id_numerique = {$lnk->quote($rep['id'])}
    SQL
  */
  async getMetsynTextId(stationId: number): Promise<string> {
    try {
      const metsyn = await this.prisma.metsyn.findFirst({
        where: { id_station: stationId },
      });
      if (!metsyn) {
        throw new Error('errors.not_found');
      }
      return metsyn.id_textuel;
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
