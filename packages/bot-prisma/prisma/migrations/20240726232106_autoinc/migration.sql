-- AlterTable
CREATE SEQUENCE reaction_id_seq;
ALTER TABLE "Reaction" ALTER COLUMN "id" SET DEFAULT nextval('reaction_id_seq');
ALTER SEQUENCE reaction_id_seq OWNED BY "Reaction"."id";
