import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtProvider {
  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {}

  async generateRefreshToken(payload) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });
  }

  async decodeRefreshToken(refreshToken: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return decodedToken;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return false;
      }
      throw err;
    }
  }

  async generateAccessToken(payload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  async decodeAccessToken(accessToken: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      return decodedToken;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return false;
      }
      throw err;
    }
  }

  async regenerateAndUpdateAccessToken(id: number, nickname: string, profileImage: string): Promise<string> {
    const accessPayload = {
      id: id,
      nickname: nickname,
      profileImage: profileImage,
    };
    const reAccessToken = this.generateAccessToken(accessPayload);
    return reAccessToken;
  }
}
