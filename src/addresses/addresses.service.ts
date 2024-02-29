import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/entities/Address.entity';
import { User } from 'src/entities/User.entity';
import { IsPrimary } from 'src/enums/is-primary.enum';
import { UsersService } from 'src/users/users.service';
import {
  DataSource,
  DeleteResult,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
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
    userId: number,
    addressId: number,
  ): Promise<void | undefined> {
    const ownAddress = await this.addressesRepository.findOne({
      where: { user: { id: userId }, id: addressId },
    });
    const isOwnAddress = !!ownAddress;
    if (!isOwnAddress) {
      throw new NotFoundException('주소가 존재하지 않습니다.');
    }
  }

  // 대표 주소지가 존재하는지 여부 확인
  async checkIsExistPrimaryAddress(
    userId: number,
  ): Promise<boolean | undefined> {
    console.log(IsPrimary.PRIMARY);
    const primaryAddress = await this.addressesRepository.findOne({
      where: { user: { id: userId }, isPrimary: IsPrimary.PRIMARY },
    });
    console.log(primaryAddress);
    const isExistPrimaryAddress = !!primaryAddress;
    console.log('isExistPrimaryAddress', isExistPrimaryAddress);
    return isExistPrimaryAddress;
  }

  // 내 주소지 중 이름이 같은 주소지가 존재하는지 여부 확인
  async checkDuplicateAddressName(
    userId: number,
    addressName: string,
  ): Promise<void | undefined> {
    const duplicateAddressName = await this.addressesRepository.findOne({
      where: { user: { id: userId }, addressName },
    });
    const isDuplicateAddressName = !!duplicateAddressName;
    if (isDuplicateAddressName) {
      throw new ConflictException('이름이 같은 주소지가 존재합니다.');
    }
  }

  // 내 주소지 중 우편번호가 같은 주소지가 존재하는지 여부 확인
  async checkDuplicateZipCode(
    userId: number,
    zipCode: string,
  ): Promise<void | undefined> {
    const duplicateZipCode = await this.addressesRepository.findOne({
      where: { user: { id: userId }, zipCode },
    });
    const isDuplicateZipCode = !!duplicateZipCode;
    if (isDuplicateZipCode) {
      throw new ConflictException('우편번호가 같은 주소지가 존재합니다.');
    }
  }

  // 내 주소지 중 이름이 같은 주소지가 존재하는지 여부 확인 (해당 id 주소지 제외)
  async checkDuplicateAddressNameExcludingId(
    userId: number,
    addressId: number,
    addressName: string,
  ): Promise<void | undefined> {
    const duplicateAddressName = await this.addressesRepository.findOne({
      where: { user: { id: userId }, addressName, id: Not(addressId) },
    });
    const isDuplicateAddressName = !!duplicateAddressName;
    if (isDuplicateAddressName) {
      throw new ConflictException('이름이 같은 주소지가 존재합니다.');
    }
  }

  // 내 주소지 중 우편번호가 같은 주소지가 존재하는지 여부 확인 (해당 id 주소지 제외)
  async checkDuplicateZipCodeExcludingId(
    userId: number,
    addressId: number,
    zipCode: string,
  ): Promise<void | undefined> {
    const duplicateZipCode = await this.addressesRepository.findOne({
      where: { user: { id: userId }, zipCode, id: Not(addressId) },
    });
    const isDuplicateZipCode = !!duplicateZipCode;
    if (isDuplicateZipCode) {
      throw new ConflictException('우편번호가 같은 주소지가 존재합니다.');
    }
  }

  // 모든 주소 가져오기
  async getAddresses(userId: number): Promise<Address[] | undefined> {
    return this.addressesRepository
      .createQueryBuilder('addresses')
      .innerJoin('addresses.user', 'user')
      .where('user.id = :userId', { userId })
      .orderBy('addresses.isPrimary', 'DESC')
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
    await this.checkDuplicateAddressName(userId, addressName);
    await this.checkDuplicateZipCode(userId, zipCode);
    const isExistPrimaryAddress = await this.checkIsExistPrimaryAddress(userId);
    const user = await this.usersService.getUserById(userId);
    const newAddress = this.addressesRepository.create({
      zipCode,
      streetAddress,
      addressName,
      receptorName,
      receptorPhone,
      receptorMobile,
      isPrimary: isExistPrimaryAddress
        ? IsPrimary.NOT_PRIMARY
        : IsPrimary.PRIMARY,
      user,
    });
    const savedAddress = await this.addressesRepository.save(newAddress);
    if (!savedAddress) {
      throw new ForbiddenException('주소지를 저장할 수 없습니다.');
    }
    return savedAddress;
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
    await this.checkIsOwnAddress(userId, addressId);
    await this.checkDuplicateAddressNameExcludingId(
      userId,
      addressId,
      addressName,
    );
    await this.checkDuplicateZipCodeExcludingId(userId, addressId, zipCode);
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
    await this.checkIsOwnAddress(userId, addressId);
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // 기존 대표 주소지를 일반 주소지로 변경
      const myAddresses = await queryRunner.manager.find(Address, {
        where: {
          user: { id: userId },
        },
      });
      for (const address of myAddresses) {
        const addressId = address.id;
        await queryRunner.manager.update(Address, addressId, {
          isPrimary: IsPrimary.NOT_PRIMARY,
        });
      }
      // 해당 일반 주소지를 대표 주소지로 변경
      await queryRunner.manager.update(Address, addressId, {
        isPrimary: IsPrimary.PRIMARY,
      });
      const addresses = await queryRunner.manager.find(Address, {
        where: {
          user: { id: userId },
        },
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
    await this.checkIsOwnAddress(userId, addressId);
    const deletedAddress = await this.addressesRepository.delete(addressId);
    if (deletedAddress.affected === 0) {
      throw new ForbiddenException('주소를 삭제할 수 없습니다.');
    }
    return deletedAddress;
  }
}
