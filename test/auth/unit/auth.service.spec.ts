import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, IAuthRepository, IAuthService } from "../../../src/domains/auth";
import { RegisterInput } from "../../../src/domains/auth/input";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import { UtilAuthRepository } from "../util/auth.repository.util";
import {createJwtProvider} from "@nestjs/jwt/dist/jwt.providers";

describe('AuthService Unit Test', () => {
	let authService: IAuthService;
	let authRepository: IAuthRepository;
	let jwtService: JwtService;
	const mockJwtService = {
		signAsync: jest.fn(),
		// add other methods you might use
	};

	beforeEach(async () => {
		const authServiceProvider = {
			provide: IAuthService,
			useClass: AuthService,
		};

		const authRepositoryProvider = {
			provide: IAuthRepository,
			useClass: UtilAuthRepository,
		};

		const app: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({
					secret: 'secret'
				}),
			],
			providers: [
				authServiceProvider,
				authRepositoryProvider,
			],
		})
			.compile();

		authService = app.get<IAuthService>(IAuthService);
		authRepository = app.get<IAuthRepository>(IAuthRepository);
		jwtService = app.get<JwtService>(JwtService);

	});

	describe('register', () => {
		it('should return an access token', async () => {
			const input: RegisterInput = {
				email: 'test@test.com',
				password: 'password',
				username: 'test',
				name: 'test',
			};
			const token = await authService.register(input);
			const result = jwtService.decode(token.access_token);
			expect(result.sub).toEqual(1);
		});
	});

});