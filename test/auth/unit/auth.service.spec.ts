import { Test, TestingModule } from '@nestjs/testing';
import {AuthRepository, AuthService, IAuthRepository, IAuthService} from "../../../src/domains/auth";
import {RegisterInput} from "../../../src/domains/auth/input";

describe('AuthService Unit Test', () => {
	let authService: IAuthService;
	let authRepository: IAuthRepository;

	beforeEach(async () => {
		const authServiceProvider = {
			provide: IAuthService,
			useClass: AuthService,
		};

		const authRepositoryProvider = {
			provide: IAuthRepository,
			useClass: AuthRepository,
		};

		const app: TestingModule = await Test.createTestingModule({
			imports: [],
			providers: [authServiceProvider, authRepositoryProvider],
		}).compile();

		authService = app.get<IAuthService>(IAuthService);
		authRepository = app.get<IAuthRepository>(IAuthRepository);
	});

	describe('register', () => {
		it('should return an access token', async () => {
			const user = {
				email: 'test@test.com',
				password: 'password',
				username: 'test',
				name: 'test',
			}
			const input: RegisterInput = {
				email: 'test@test.com',
				password: 'password',
				username: 'test',
				name: 'test',
			};
			jest.spyOn(authRepository, 'createUser').mockImplementation(() => Promise.resolve(user));
			const result = await authService.register(input);
			// la linea que le sigue esta mal porque estas pidiendo que un user sea igual al token
			expect(result).toEqual(user);
		});
	});
});