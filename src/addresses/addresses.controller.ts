import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from 'src/auth/auth-status.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressStatusDto } from './dto/update-address-status.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  // 내 주소 목록 가져오기
  @UseGuards(LoggedInGuard)
  @Get('')
  async getAddresses(@UserId() userId: number) {
    return this.addressesService.getAddresses(userId);
  }

  // 특정 주소 가져오기
  @UseGuards(LoggedInGuard)
  @Get(':id')
  async getAddress(
    @UserId() userId: number,
    @Param('id', ParseIntPipe) addressId: number,
  ) {
    return this.addressesService.getAddress(userId, addressId);
  }

  // 주소 등록하기
  @UseGuards(LoggedInGuard)
  @Post('')
  async createAddress(
    @UserId() userId: number,
    @Body(ValidationPipe) createAddressDto: CreateAddressDto,
  ) {
    const {
      zipCode,
      streetAddress,
      addressName,
      receptorName,
      receptorPhone,
      receptorMobile,
    } = createAddressDto;
    return this.addressesService.createAddress({
      userId,
      zipCode,
      streetAddress,
      addressName,
      receptorName,
      receptorPhone,
      receptorMobile,
    });
  }

  // 주소 수정하기
  @UseGuards(LoggedInGuard)
  @Post(':id')
  async updateAddress(
    @UserId() userId: number,
    @Param(ParseIntPipe) addressId: number
    @Body(ValidationPipe) updateAddressDto: UpdateAddressDto,
  ) {
    const {
      zipCode,
      streetAddress,
      addressName,
      receptorName,
      receptorPhone,
      receptorMobile,
    } = updateAddressDto;
    return this.addressesService.updateAddress({
      userId,
      addressId,
      zipCode,
      streetAddress,
      addressName,
      receptorName,
      receptorPhone,
      receptorMobile,
    });
  }

  // 주소 대표여부 변경하기
  @UseGuards(LoggedInGuard)
  @Patch('')
  async updateAddressPrimaryStatus(
    @UserId() userId: number,
    @Body(ValidationPipe) updateAddressStatusDto: UpdateAddressStatusDto,
  ) {
    const { isPrimary } = updateAddressStatusDto;
    return this.addressesService.updateAddressPrimaryStatus(userId, isPrimary);
  }
}
