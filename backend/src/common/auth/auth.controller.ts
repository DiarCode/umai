import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignupDto } from './dto/signup.dto'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { CookieService } from '../cookies/cookie.service'

@Controller('auth/admin')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: any) {
    const { admin, token } = await this.authService.signup(dto)

    //TODO: CookieService
    // git fetch && git checkout main && git pull && git checkout feature/admin-auth && git merge
    CookieService.assignAuthToken(res, token)

    return admin
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const { admin, token } = await this.authService.login(dto)

    CookieService.assignAuthToken(res, token)

    return admin
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return this.authService.getCurrentAdmin(req.user.userId)
  }
}