import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  private usersRepository: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);

    this.usersRepository = getRepository(User)
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games')
      .where(`lower(games.title) LIKE :param`, { param: `%${param.toLowerCase().replace(' ', '%')}%` })
      .getMany()
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const result = await this.repository.query('select count(*) as amount from games'); // Complete usando raw query

    return [
      {
        count: result[0].amount
      }
    ]
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.usersRepository
      .createQueryBuilder('users')
      .innerJoin('users.games', 'games')
      .where('games.id = :id', { id })
      .getMany()
      // Complete usando query builder
  }
}
