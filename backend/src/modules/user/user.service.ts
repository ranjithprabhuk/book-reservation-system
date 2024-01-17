import { Injectable } from '@nestjs/common';
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
          'Name, Description and ISBN values are required to add a user',
        );
      }
      const response = this._userRepository.save(createUserDto);
      return response;
    } catch (e) {
      throw e;
    }
  }

  findAll() {
    try {
      const response = this._userRepository.findAndCount({
        where: [{ isActive: true }],
      });
      return response;
    } catch (e) {
      throw e;
    }
  }

  public async search(pageOptionsDto: PageOptionsDto): Promise<PageDto<any>> {
    try {
      const queryBuilder = this._userRepository.createQueryBuilder('user');
      const whereClause = pageOptionsDto.searchText
        ? SqlUtility.getSearchTextWhereClause('user', [
            'name',
            'description',
            'ISBN',
          ])
        : '';

      queryBuilder
        .select()
        .where(whereClause)
        .orderBy(`user.${pageOptionsDto.orderBy}`, pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.take)
        .setParameters({ searchText: `%${pageOptionsDto.searchText}%` });

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw e;
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
      throw e;
    }
  }

  findUserByUsername(username: string) {
    try {
      if (!username) {
        throw new ValidationError(
          'Username is required to get the user information',
        );
      }
      const response = this._userRepository.findOne({ where: [{ username }] });
      return response;
    } catch (e) {
      throw e;
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
      throw e;
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
      throw e;
    }
  }
}
