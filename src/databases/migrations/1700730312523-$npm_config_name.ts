import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1700730312523 implements MigrationInterface {
    name = ' $npmConfigName1700730312523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`hasedIdx\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_00f0ef347f5ada8fc005d071c1\` (\`hasedIdx\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_00f0ef347f5ada8fc005d071c1\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`hasedIdx\``);
    }

}
