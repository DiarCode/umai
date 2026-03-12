import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { SignupDto } from './dto/auth.dto'
import { LoginDto } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    // QWEN / Z.AI / Kimi
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

  //me : take from db 
  async getCurrentAdmin(id: string) {
    return this.prisma.platformAdmin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    })
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