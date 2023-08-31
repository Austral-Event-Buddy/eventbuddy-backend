import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Auth', () => {
    describe('Register', () => {
      it.todo('should sign up');
    })
    describe('Login', () => {
      it.todo('should log in');
    })
  });
  describe('User', () => {
    describe('Get me', () => {
      it.todo('should get user info');
    })
  });
  describe('Event', () => {
    describe('Get events', () => {
      it.todo('should get events by user id');
    })
    describe('Search event by name or description', () => {
      it.todo('should throw event info where the string matches name or description');
    })
    describe('Create event', () => {
      it.todo('create event');
    })
    describe('update event', () => {
      it.todo('update event');
    })
    describe('delete event', () => {
      it.todo('delete event');
    })
  });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //       .get('')
  //       .expect(200)
  //       .expect('Hello World!');
  // });
});
