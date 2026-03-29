import { Injectable } from '@nestjs/common';
import { CarteMaCacheRepository } from './carte-ma-cache.repository';
import { CarteMaCacheQuery, CarteMaCacheRow } from './carte-ma-cache.types';

@Injectable()
export class CarteMaCacheService {
  constructor(private readonly repository: CarteMaCacheRepository) {}

  async getRowsInBoundingBox(
    query: CarteMaCacheQuery,
  ): Promise<CarteMaCacheRow[]> {
    return await this.repository.findInBoundingBox(query);
  }
}
