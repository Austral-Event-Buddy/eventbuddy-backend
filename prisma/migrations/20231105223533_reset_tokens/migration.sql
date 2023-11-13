-- AlterTable
CREATE SEQUENCE passwordresettoken_id_seq;
ALTER TABLE "PasswordResetToken" ALTER COLUMN "id" SET DEFAULT nextval('passwordresettoken_id_seq');
ALTER SEQUENCE passwordresettoken_id_seq OWNED BY "PasswordResetToken"."id";
