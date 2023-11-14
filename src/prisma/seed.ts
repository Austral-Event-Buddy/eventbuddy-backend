// import { AuthService } from "../domains/auth/service/auth.service";
// import { UserService } from "../domains/user/service/user.service";
// import { EventService } from "../domains/event/service/event.service";
// import { ElementService } from "../domains/element/service/element.service";
// import { CommentService } from "../domains/comment/service/comment.service";
//
// import { AuthRepository } from "../domains/auth/repository/auth.repository";
// import { UserRepository } from "../domains/user/repository/user.repository";
// import { EventRepository } from "../domains/event/repository/event.repository";
// import { ElementRepository } from "../domains/element/repository/element.repository";
// import { CommentRepository } from "../domains/comment/repository/comment.repository";
//
// import { IMailService } from "../domains/mail/service/mail.service.interface";
//
// import { PrismaService } from "./prisma.service";
//
// import { ConfigService } from "@nestjs/config";
// import { JwtService } from '@nestjs/jwt';
//
// class DummyMailService implements IMailService {
//   sendEmail(to: string, templateId: string, data: any): Promise<void> {
//     return Promise.resolve();
//   }
// }
//
// const configService = new ConfigService();
//
// const prismaService = new PrismaService(configService);
//
// const mailService = new DummyMailService();
//
// const jwtService = new JwtService({
//   secret: 'secret',
// });
//
// const authService = new AuthService(new AuthRepository(prismaService), jwtService);
// const userService = new UserService(new UserRepository(prismaService), mailService, configService);
// const eventService = new EventService(new EventRepository(prismaService), userService);
// const elementService = new ElementService(new ElementRepository(prismaService));
// const commentService = new CommentService(new CommentRepository(prismaService));
//
// const users: { email: string, name: string}[] = [
//   { email: 'jane@test.com', name: 'Jane Doe'},
//   { email: 'john@test.com', name: 'John Doe'},
//   { email: 'jake@test.com', name: 'Jake Smith'},
//   { email: 'joe@test.com', name: 'Joe Smith'},
//   { email: 'david@test.com', name: 'David First'},
//   { email: 'marie@test.com', name: 'Marie Second'},
// ]
//
// const addDays = (date: Date, days: number) => {
//   const newDate = new Date(date);
//   newDate.setDate(newDate.getDate() + days);
//   return newDate;
// }
//
// const events = [
//   {
//     name: 'Birthday Party',
//     description: 'Join us for a fun birthday celebration!',
//     coordinates: [40.7128, -74.0060],
//     date: addDays(new Date(), 3),
//   },
//   {
//     name: 'Family Picnic',
//     description: 'Enjoy a day outdoors with family and friends.',
//     coordinates: [34.0522, -118.2437],
//     date: addDays(new Date(), 5),
//   },
//   {
//     name: 'Beach Party',
//     description: 'Join us for a day of fun in the sun at the beach!',
//     coordinates: [25.7617, -80.1918],
//     date: addDays(new Date(), 10),
//   },
//   {
//     name: 'Cooking Class',
//     description: 'Learn to cook delicious dishes with our expert chefs.',
//     coordinates: [34.0522, -118.2437],
//     date: addDays(new Date(), 12),
//   },
//   {
//     name: 'Art Exhibition',
//     description: 'Explore the world of art at our exhibition!',
//     coordinates: [51.5074, -0.1278],
//     date: addDays(new Date(), 15),
//   },
//   {
//     name: 'Movie Night',
//     description: 'Watch your favorite movies with friends and popcorn!',
//     coordinates: [40.7128, -74.0060],
//     date: addDays(new Date(), 20),
//   }
// ]
//
// const create = async () => {
//   await prismaService.user.deleteMany();
//
//   const u = await Promise.all(
//     users.map(async (user, index) => {
//       await authService.register({
//         email: user.email,
//         password: 'password',
//         username: user.name.toLowerCase().replace(' ', '_'),
//         name: user.name,
//       })
//
//       const u = await userService.getUserByUsername(user.name.toLowerCase().replace(' ', '_'));
//       const created = u[0];
//
//       const e = events[index]
//
//       const event = await eventService.createEvent(created.id, { ...e, confirmationDeadline: addDays(e.date, -1) });
//
//       return {
//         event,
//         user: created,
//       }
//     })
//   )
//
//   const [jane, john, jake, joe, david, marie] = u;
//
//   await eventService.inviteGuest({ eventId: jane.event.id, userId: john.user.id, isHost: true }, jane.user.id);
//   await eventService.inviteGuest({ eventId: jane.event.id, userId: jake.user.id, isHost: false }, jane.user.id);
//   await eventService.inviteGuest({ eventId: jane.event.id, userId: joe.user.id, isHost: false }, jane.user.id);
//   await eventService.inviteGuest({ eventId: jane.event.id, userId: david.user.id, isHost: false }, jane.user.id);
//   await eventService.inviteGuest({ eventId: jane.event.id, userId: marie.user.id, isHost: false }, jane.user.id);
//
//   await eventService.inviteGuest({ eventId: john.event.id, userId: jane.user.id, isHost: false }, john.user.id);
//
//   await eventService.inviteGuest({ eventId: jake.event.id, userId: jane.user.id, isHost: true }, jake.user.id);
//   await eventService.inviteGuest({ eventId: jake.event.id, userId: john.user.id, isHost: true }, jake.user.id);
//   await eventService.inviteGuest({ eventId: jake.event.id, userId: joe.user.id, isHost: false }, jake.user.id);
//   await eventService.inviteGuest({ eventId: jake.event.id, userId: david.user.id, isHost: false }, jake.user.id);
//   await eventService.inviteGuest({ eventId: jake.event.id, userId: marie.user.id, isHost: false }, jake.user.id);
//
//   await eventService.inviteGuest({ eventId: joe.event.id, userId: jane.user.id, isHost: true }, joe.user.id);
//   await eventService.inviteGuest({ eventId: joe.event.id, userId: john.user.id, isHost: true }, joe.user.id);
//   await eventService.inviteGuest({ eventId: joe.event.id, userId: jake.user.id, isHost: true }, joe.user.id);
//   await eventService.inviteGuest({ eventId: joe.event.id, userId: david.user.id, isHost: false }, joe.user.id);
//   await eventService.inviteGuest({ eventId: joe.event.id, userId: marie.user.id, isHost: false }, joe.user.id);
//
//   await eventService.inviteGuest({ eventId: david.event.id, userId: jane.user.id, isHost: false }, david.user.id);
//   await eventService.inviteGuest({ eventId: david.event.id, userId: john.user.id, isHost: false }, david.user.id);
//   await eventService.inviteGuest({ eventId: david.event.id, userId: jake.user.id, isHost: false }, david.user.id);
//   await eventService.inviteGuest({ eventId: david.event.id, userId: joe.user.id, isHost: false }, david.user.id);
//   await eventService.inviteGuest({ eventId: david.event.id, userId: marie.user.id, isHost: false }, david.user.id);
//
//   await eventService.inviteGuest({ eventId: marie.event.id, userId: jane.user.id, isHost: false }, marie.user.id);
//   await eventService.inviteGuest({ eventId: marie.event.id, userId: john.user.id, isHost: false }, marie.user.id);
//   await eventService.inviteGuest({ eventId: marie.event.id, userId: jake.user.id, isHost: false }, marie.user.id);
// }
//
// create()
//   .then(() => {
//     console.log('Done!');
//     process.exit(0);
//   })
//   .catch(err => {
//     console.error(err);
//     process.exit(1);
//   })
