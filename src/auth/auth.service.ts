import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/partners/services/user.service';
import { AuthenticatedUser } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash: _, ...rest } = user;

      // Mapeo: role viene de userTypeId
      return {
        ...rest,
        role: user.userTypeId,
      } as AuthenticatedUser;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: AuthenticatedUser) {
    const payload = {
      username: user.username,
      user_id: user.id,
      role: user.role,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
