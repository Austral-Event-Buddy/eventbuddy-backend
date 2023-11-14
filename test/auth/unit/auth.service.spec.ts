import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, IAuthRepository, IAuthService } from "../../../src/domains/auth";
import {LoginInput, RegisterInput, ResetPasswordInput} from "../../../src/domains/auth/input";
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UtilAuthRepository } from "../util/auth.repository.util";
import {User} from "@prisma/client";
import {SendgridMailService} from "../../../src/domains/mail/service/sendgrid.mail.service";
import {MockMailService} from "../../mail/mockmail.service";
import {ConfigService} from "@nestjs/config";
import {UserService} from "../../../src/domains/user/service/user.service";
import * as bcrypt from 'bcrypt';
import {UserRepository} from "../../../src/domains/user/user.repository";
import {IUserRepository} from "../../../src/domains/user/repository/user.repository.interface";
import {UserServiceUtil} from "../../user/util/user.service.util";
import {UserRepositoryUtil} from "../../user/util/user.repository.util";
import {IUserService} from "../../../src/domains/user/service/user.service.inteface";
import {UserDto} from "../../../src/domains/user/dto/user.dto";

describe('AuthService Unit Test', () => {
	let authService: IAuthService;
	let authRepository: IAuthRepository;
	let jwtService: JwtService;
    let userService: IUserService;

	beforeEach(async () => {
		const authServiceProvider = {
			provide: IAuthService,
			useClass: AuthService,
		};

		const authRepositoryProvider = {
			provide: IAuthRepository,
			useClass: UtilAuthRepository,
		};

        const mailServiceProvider = {
            provide: 'IMailService',
            useClass: MockMailService
        }

        const userServiceProvider = {
            provide: 'IUserService',
            useClass: UserServiceUtil
        }

        const userRepositoryProvider = {
            provide: 'IUserRepository',
            useClass: UserRepositoryUtil
        }


		const app: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({
					secret: 'secret'
				}),
			],
			providers: [
				authServiceProvider,
				authRepositoryProvider,
                mailServiceProvider,
                ConfigService,
                userServiceProvider,
                userRepositoryProvider

			],
		})
			.compile();

		authService = app.get<IAuthService>(IAuthService);
		authRepository = app.get<IAuthRepository>(IAuthRepository);
		jwtService = app.get<JwtService>(JwtService);
		const input: RegisterInput = {
			email: 'test@test.com',
			password: 'password',
			username: 'test',
			name: 'test',
		};
		await authService.register(input);
	});

	describe('register', () => {
		it('should return an access token', async () => {
			const input: RegisterInput = {
				email: 'test1@test.com',
				password: 'password',
				username: 'test1',
				name: 'test',
			};
			const token = await authService.register(input);
			const result = jwtService.decode(token.access_token);
			expect(result.sub).toEqual(2);
		});
	});
	describe('login', () => {
		it('with email', async () => {
			const input: LoginInput = {
				username: '',
				email: 'test@test.com',
				password: 'password',
			};
			const token = await authService.login(input);
			const result = jwtService.decode(token.access_token);
			expect(result.sub).toEqual(1);
		});
		it('with username', async () => {
			const input: LoginInput = {
				username: 'test',
				email: '',
				password: 'password',
			};
			const token = await authService.login(input);
			const result = jwtService.decode(token.access_token);
			expect(result.sub).toEqual(1);
		});
	});
	// TO-DO: should find user by id, but token undefined
	describe('user by id', () => {
		it('token', async () => {
			const user: UserDto = {
				id: 1,
				email: 'test@test.com',
				username: 'test',
				password: 'password',
				name: 'test',
				defaultPic: false,
				createdAt: undefined,
				updatedAt: undefined,
			};
			const result = await authService.findUserById(1);
			delete result.password;
			delete user.password;
			expect(result).toEqual(user);
		});
	});

    describe('reset password', () => {
        it('with valid token', async () => {
            const user: User = {
                id: 1,
                email: 'test@test.com',
                username: 'test',
                password: 'password',
                name: 'test',
                createdAt: undefined,
                updatedAt: undefined,
            }; //This user was also hardcoded in the user.repository.util.ts
            let newPassword = "12345678"
            let token = await authService.sendResetPasswordEmail(user.email);
            let resetPasswordInput = new ResetPasswordInput
            resetPasswordInput.token = token;
            resetPasswordInput.newPassword = newPassword;
            let endUser = await authService.resetPassword(resetPasswordInput);
            expect(endUser).not.toBeUndefined()
            expect(await bcrypt.compare(newPassword, endUser.password)).toBeTruthy()

        })
    })

});