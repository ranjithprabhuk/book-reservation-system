import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'src/shared/exceptions/validation.exception';
import { PageOptionsDto } from 'src/shared/dto/page-options.dto';
import { PageDto } from 'src/shared/dto/page.dto';
import { PageMetaDto } from 'src/shared/dto/page-meta.dto';
import { SqlUtility } from 'src/shared/utility/sql.utility';
import * as userData from '../../seed-data/users.json';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private _userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    try {
      if (
        !createUserDto.firstName ||
        !createUserDto.lastName ||
        !createUserDto.username ||
        !createUserDto.password
      ) {
        throw new ValidationError(
          'Firstname, Lastname, Username and Password values are required to create a user',
        );
      }
      const response = this._userRepository.save(createUserDto);
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async loadUsers() {
    try {
      const count = await this._userRepository.count();
      if (count === 0) {
        const saltOrRounds = parseInt(process.env.SALT_ROUND) || 10;
        const users = await this._userRepository.create(userData);
        for (const user of users) {
          user.password = await bcrypt.hash(user.password, saltOrRounds);
        }
        await this._userRepository.save(users);

        return 'Success';
      } else {
        return 'User information is already seeded in the system';
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findAll() {
    try {
      const response = this._userRepository.findAndCount({
        where: [{ isActive: true }],
      });
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  public async search(pageOptionsDto: PageOptionsDto): Promise<PageDto<any>> {
    try {
      const queryBuilder = this._userRepository.createQueryBuilder('user');
      const whereClause = pageOptionsDto.searchText
        ? SqlUtility.getSearchTextWhereClause('user', [
            'firstName',
            'lastName',
            'username',
            'role',
          ])
        : '';

      queryBuilder
        .select()
        .where(whereClause)
        .andWhere('user.isActive = true')
        .orderBy(`user.${pageOptionsDto.orderBy}`, pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .setParameters({
          searchText: `%${decodeURIComponent(pageOptionsDto.searchText)}%`,
        });

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findOne(id: string) {
    try {
      if (!id) {
        throw new ValidationError(
          'User ID is required to get the user information',
        );
      }
      const response = this._userRepository.findOne({ where: [{ id }] });
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findUserReservations(userId: string) {
    try {
      if (!userId) {
        throw new ValidationError(
          'User ID is required to get the user information',
        );
      }
      const queryBuilder = this._userRepository.createQueryBuilder('user');

      const user = queryBuilder
        .leftJoinAndSelect('user.bookReservations', 'reservation')
        .leftJoinAndSelect('reservation.book', 'book')
        .where('user.id = :userId', { userId })
        .getOne();

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return user;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findUserByUsername(username: string) {
    try {
      if (!username) {
        throw new ValidationError(
          'Username is required to get the user information',
        );
      }
      const response = this._userRepository.findOne({
        where: [{ username, isActive: true }],
        select: ['password', 'username', 'id', 'role', 'firstName', 'lastName'],
      });
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!id) {
        throw new ValidationError('User ID is required to update the value');
      }
      const response = this._userRepository.update({ id }, updateUserDto);
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  inActivate(id: string) {
    try {
      if (!id) {
        throw new ValidationError('User ID is required to inactivate it');
      }
      const response = this._userRepository.update(id, { isActive: false });
      return response;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
