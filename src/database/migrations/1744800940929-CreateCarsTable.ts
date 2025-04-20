import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCarsTable1744800940929 implements MigrationInterface {
    name = 'CreateCarsTable1744800940929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "brand" character varying NOT NULL, "model" character varying NOT NULL, "stock" integer NOT NULL, "peak_seasson_price_per_day" double precision NOT NULL, "mid_seasson_price_per_day" double precision NOT NULL, "off_seasson_price_per_day" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cars"`);
    }

}
