import { MigrationInterface, QueryRunner } from "typeorm";

export class FixColumnName1745157659936 implements MigrationInterface {
    name = 'FixColumnName1745157659936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "peak_seasson_price_per_day"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "mid_seasson_price_per_day"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "off_seasson_price_per_day"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "peak_season_price_per_day" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "mid_season_price_per_day" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "off_season_price_per_day" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "off_season_price_per_day"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "mid_season_price_per_day"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "peak_season_price_per_day"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "off_seasson_price_per_day" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "mid_seasson_price_per_day" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "peak_seasson_price_per_day" double precision NOT NULL`);
    }

}
