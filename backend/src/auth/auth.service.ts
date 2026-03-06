import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../common/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { SignupDto } from './dto/signup.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10)

    const admin = await this.prisma.platformAdmin.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        fullName: dto.fullName,
      },
    })

    const token = this.jwtService.sign({
      sub: admin.id,
      role: admin.role,
    })

    return { admin, token }
  }

  async login(dto: LoginDto) {
    const admin = await this.prisma.platformAdmin.findUnique({
      where: { email: dto.email },
    })

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      admin.passwordHash,
    )

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const token = this.jwtService.sign({
      sub: admin.id,
      role: admin.role,
    })

    return { admin, token }
  }

  async findAdminById(id: string) {
    return this.prisma.platformAdmin.findUnique({
      where: { id },
    })
  }
}