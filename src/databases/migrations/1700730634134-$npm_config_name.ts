import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1700730634134 implements MigrationInterface {
    name = ' $npmConfigName1700730634134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_00f0ef347f5ada8fc005d071c1\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`hasedIdx\` \`hashIdx\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`hashIdx\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`hashIdx\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_740ff8fa1f5d01aa76712b9b33\` (\`hashIdx\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_740ff8fa1f5d01aa76712b9b33\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`hashIdx\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`hashIdx\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`hashIdx\` \`hasedIdx\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_00f0ef347f5ada8fc005d071c1\` ON \`user\` (\`hasedIdx\`)`);
    }

}
