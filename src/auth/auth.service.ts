/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, pass: string, nickname: string, roles: number) {
    const existingEmail = await this.usersService.getUserByEmail(email);
    if (existingEmail) {
      throw new UnauthorizedException('이미 존재하는 이메일입니다.');
    }
    const existingNickname =
      await this.usersService.getUserByNickname(nickname);
    if (existingNickname) {
      throw new UnauthorizedException('이미 존재하는 닉네임입니다.');
    }
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newUser = await this.usersService.createUser(
      email,
      hashedPassword,
      nickname,
      roles,
    );
    if (!newUser) {
      throw new InternalServerErrorException(
        '새 사용자를 생성하는 데 실패했습니다.',
      );
    }
    const { password, ...result } = newUser;
    return result;
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('비밀번호가 다릅니다.');
    }
    const payload = { id: user.id, email: user.email, roles: user.roles };
    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async checkAuthState(id: number) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    const { password, ...result } = user;
    return result;
  }

  async deleteAccount(id: number, pass: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('비밀번호를 틀렸습니다.');
    }
    this.usersService.deleteUserById(user.id);
  }
}
