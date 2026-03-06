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

@Controller('auth/admin')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) res: any) {
    const { admin, token } = await this.authService.signup(dto)

    //TODO: CookieService
    // git fetch && git checkout main && git pull && git checkout feature/admin-auth && git merge
    res.setCookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })

    return admin
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const { admin, token } = await this.authService.login(dto)

    res.setCookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })

    return admin
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return req.user
  }
}