import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Constants } from '../utils';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: Constants.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [PrismaModule],
})
export class AuthModule {}
