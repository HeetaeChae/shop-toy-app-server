import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entities/Address.entity';
import { IsPrimary } from 'src/enums/is-primary.enum';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressesRepository: Repository<Address>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async getAddresses(userId: number) {
    return this.addressesRepository
      .createQueryBuilder('addresses')
      .innerJoin('addresses.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async getAddress(userId: number, addressId: number) {
    return this.addressesRepository
      .createQueryBuilder('address')
      .innerJoin('address.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('address.id = :addressId', { addressId })
      .getOne();
  }

  async createAddress({
    zipCode,
    streetAddress,
    addressName,
    receptorName,
    receptorPhone,
    receptorMobile,
    userId,
  }: CreateAddressDto & { userId: number }) {
    const user = await this.usersService.getUserById(userId);
    const existingPrimaryAddress = await this.addressesRepository
      .createQueryBuilder('addresses')
      .innerJoin('addresses.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('addresses.isPrimary = :isPrimary', {
        isPrimary: IsPrimary.PRIMARY,
      })
      .getExists();
    const newUser = this.addressesRepository.create({
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
    return this.addressesRepository.save(newUser);
  }

  async updateAddress({
    userId,
    addressId,
    zipCode,
    streetAddress,
    addressName,
    receptorName,
    receptorPhone,
    receptorMobile,
  }: CreateAddressDto & { userId: number; addressId: number }) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    const addressToUpdate = await this.addressesRepository.findOne({
      where: { id: addressId, user },
    });
    if (!addressToUpdate) {
      throw new NotFoundException('주소가 존재하지 않습니다.');
    }
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

  async updateAddressPrimaryStatus(userId: number, addressId: number) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const primaryAddress = await this.addressesRepository.find({
        where: { user, isPrimary: IsPrimary.PRIMARY },
      });
      for (const address of primaryAddress) {
        await this.addressesRepository.update(address.id, {
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
}
