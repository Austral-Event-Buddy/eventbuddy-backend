import {CommentService, ICommentService} from "../../../src/domains/comment/service";
import {ICommentRepository} from "../../../src/domains/comment/repository";
import {CommentRepositoryUtil} from "../util/comment.repository.util";
import {Test, TestingModule} from "@nestjs/testing";
import {NewCommentInput} from "../../../src/domains/comment/input";
import {Comment} from "@prisma/client";

describe('CommentService Unit Test',()=>{
    let commentService: ICommentService;
    beforeEach(async() => {
const eventServiceProvider = {
            provide: ICommentService,
            useClass: CommentService,
        }
        const eventRepositoryProvider = {
            provide: ICommentRepository,
            useClass: CommentRepositoryUtil,
        }
        const app: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                eventRepositoryProvider,
                eventServiceProvider,
            ],
        })
            .compile();
        commentService = app.get<ICommentService>(ICommentService);

    })
    const userId = 1;
    const newCommentInput:NewCommentInput={
        eventId: 1,
        text: "test",
        parentId: undefined
    }
    const newCommentWithParent: NewCommentInput={
        eventId: 1,
        text: "test",
        parentId: 1
    }
    it('Create new comment',async()=>{
        const comment : Comment = {
            id: 1,
            text: newCommentInput.text,
            userId: userId,
            parentId: newCommentInput.parentId || undefined,
            eventId: newCommentInput.eventId,
            createdAt: undefined,
            updatedAt: undefined,
        }
        const result = await commentService.createComment(userId,newCommentInput);
        expect(result).toEqual(comment);
    })
    it('Create new comment with parent',async()=>{
        const comment : Comment={
            id: 1,
            text: newCommentWithParent.text,
            userId: userId,
            parentId: newCommentWithParent.parentId || undefined,
            eventId: newCommentWithParent.eventId,
            createdAt: undefined,
            updatedAt: undefined,
        }
        const result = await commentService.createComment(userId,newCommentWithParent);
        expect(result).toEqual(comment);
    })
    describe("Update comment",()=>{
        const newText = "new text";
        it('Update comment',async()=>{
            const comment :Comment = await commentService.createComment(userId,newCommentInput);
            const result = await commentService.updateComment(userId,comment.id,newText);
            expect(comment.text).not.toEqual(result.text);
            expect(result.text).toEqual(newText);
            expect(result.id).toEqual(comment.id);
        })
        it('Delete comment',async()=>{
            const comment :Comment = await commentService.createComment(userId,newCommentInput);
            await commentService.deleteComment(userId,comment.id);
            const result = await commentService.getCommentsByEventId(comment.eventId);
            expect(result).toEqual([]);
        })

    })
    describe("Get comments",()=>{
        it('Get comments by event id',async()=>{
            const comment :Comment = await commentService.createComment(userId,newCommentInput);
            const result = await commentService.getCommentsByEventId(comment.eventId);
            expect(result).toEqual([comment]);
        })
    })
    describe("Check if user is author",()=>{
        it('User is author',async()=>{
            const comment : Comment = await commentService.createComment(userId,newCommentInput)
            const result = await commentService.checkIfUserIsAuthor(userId,comment.id)
            expect(result).toEqual(true);
        })
        it('User is not author',async()=>{
            const comment : Comment = await commentService.createComment(userId, newCommentInput)
            const result = await commentService.checkIfUserIsAuthor(2,comment.id)
            expect(result).toEqual(false);
        })
    })

})