import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entities/Address.entity';
import { User } from 'src/entities/User.entity';
import { IsPrimary } from 'src/enums/is-primary.enum';
import { UsersService } from 'src/users/users.service';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressesRepository: Repository<Address>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  // 수정할 주소가 존재하는지 여부 (유저 정보 대조)
  async checkIsOwnAddress(
    user: User,
    addressId: number,
  ): Promise<Address | undefined> {
    const ownAddress = await this.addressesRepository.findOne({
      where: { user, id: addressId },
    });
    if (!ownAddress) {
      throw new NotFoundException('업데이트할 주소가 존재하지 않습니다.');
    }
    return ownAddress;
  }

  // 모든 주소 가져오기
  async getAddresses(userId: number): Promise<Address[] | undefined> {
    return this.addressesRepository
      .createQueryBuilder('addresses')
      .innerJoin('addresses.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('isPrimary', 'DESC')
      .getMany();
  }

  // 특정 주소 가져오기
  async getAddress(
    userId: number,
    addressId: number,
  ): Promise<Address | undefined> {
    return this.addressesRepository
      .createQueryBuilder('address')
      .innerJoin('address.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('address.id = :addressId', { addressId })
      .getOne();
  }

  // 주소 생성하기
  async createAddress({
    zipCode,
    streetAddress,
    addressName,
    receptorName,
    receptorPhone,
    receptorMobile,
    userId,
  }: CreateAddressDto & { userId: number }): Promise<Address | undefined> {
    const user = await this.usersService.getUserById(userId);
    const existingPrimaryAddress = await this.addressesRepository.findOne({
      where: { user, isPrimary: IsPrimary.PRIMARY },
    });
    const newAddress = this.addressesRepository.create({
      zipCode,
      streetAddress,
      addressName,
      receptorName,
      receptorPhone,
      receptorMobile,
      isPrimary: existingPrimaryAddress
        ? IsPrimary.NOTPRIMARY
        : IsPrimary.PRIMARY,
      user,
    });
    return this.addressesRepository.save(newAddress);
  }

  // 주소 수정하기
  async updateAddress({
    userId,
    addressId,
    zipCode,
    streetAddress,
    addressName,
    receptorName,
    receptorPhone,
    receptorMobile,
  }: CreateAddressDto & { userId: number; addressId: number }): Promise<
    UpdateResult | undefined
  > {
    const user = await this.usersService.getUserById(userId);
    await this.checkIsOwnAddress(user, addressId);
    const updatedAddress = await this.addressesRepository.update(addressId, {
      zipCode,
      streetAddress,
      addressName,
      receptorName,
      receptorPhone,
      receptorMobile,
    });
    if (updatedAddress.affected === 0) {
      throw new NotFoundException('주소 수정을 실패했습니다.');
    }
    return updatedAddress;
  }

  // 대표 주소지 여부 수정하기
  async updateAddressPrimaryStatus(
    userId: number,
    addressId: number,
  ): Promise<void | undefined> {
    const user = await this.usersService.getUserById(userId);
    await this.checkIsOwnAddress(user, addressId);
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const primaryAddresses = await this.addressesRepository.find({
        where: { user, isPrimary: IsPrimary.PRIMARY },
      });
      for (const primaryAddress of primaryAddresses) {
        await this.addressesRepository.update(primaryAddress.id, {
          isPrimary: IsPrimary.NOTPRIMARY,
        });
      }
      await this.addressesRepository.update(addressId, {
        isPrimary: IsPrimary.PRIMARY,
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 주소 삭제
  async deleteAddress(
    userId: number,
    addressId: number,
  ): Promise<DeleteResult | undefined> {
    const user = await this.usersService.getUserById(userId);
    await this.checkIsOwnAddress(user, addressId);
    const deletedAddress = await this.addressesRepository.delete(addressId);
    if (deletedAddress.affected === 0) {
      throw new ForbiddenException('주소를 삭제할 수 없습니다.');
    }
    return deletedAddress;
  }
}
