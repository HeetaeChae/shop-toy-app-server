import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserPayload } from 'src/decorators/user-payload.decorator';
import { UserPayloadDto } from './dto/user-payload.dto';
import { LoggedInGuard, NotLoggedInGuard } from './auth-status.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '회원가입', description: '회원가입 기능' })
  @UseGuards(NotLoggedInGuard)
  @Post('signup')
  async signup(@Body(new ValidationPipe()) signupDto: SignupDto) {
    const { email, password, nickname, roles } = signupDto;
    return this.authService.signup(email, password, nickname, roles);
  }

  @ApiOperation({ summary: '로그인', description: '로그인 기능' })
  @UseGuards(NotLoggedInGuard)
  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @ApiOperation({
    summary: '인증 상태 확인',
    description: '페이로드 id로 유저 정보 출력 기능',
  })
  @UseGuards(LoggedInGuard)
  @Get('check-auth-state')
  async checkAuthState(@UserPayload() userPayloadDto: UserPayloadDto) {
    const { id } = userPayloadDto;
    return this.authService.checkAuthState(id);
  }

  @ApiOperation({
    summary: '계정 삭제',
    description: '페이로드 id와 password로 계정 삭제 기능',
  })
  @UseGuards(LoggedInGuard)
  @Post('delete-account')
  async deleteAccount(
    @UserPayload() userPayloadDto: UserPayloadDto,
    @Body() deleteAccountDto: DeleteAccountDto,
  ) {
    const { id } = userPayloadDto;
    const { password } = deleteAccountDto;
    this.authService.deleteAccount(id, password);
  }
}
