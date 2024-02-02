import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entities/Address.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressesRepository: Repository<Address>,
    private usersService: UsersService,
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
    // 만약 대표 주소지가 없는 경우라면 isPrimary를 1로 준다.
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
  }: CreateAddressDto & { userId: number; addressId: number }) {}

  async updateAddressPrimaryStatus() {}
}
