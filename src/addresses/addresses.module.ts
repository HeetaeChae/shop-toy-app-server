import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/entities/Address.entity';
import { UsersModule } from 'src/users/users.module';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UsersModule],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
