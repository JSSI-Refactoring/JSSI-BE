import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1700654174311 implements MigrationInterface {
    name = ' $npmConfigName1700654174311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_7b0580ed0bf7364a7d4d11d5b2\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`accessToken\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`accessToken\` varchar(300) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_7b0580ed0bf7364a7d4d11d5b2\` (\`accessToken\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_7b0580ed0bf7364a7d4d11d5b2\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`accessToken\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`accessToken\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_7b0580ed0bf7364a7d4d11d5b2\` ON \`user\` (\`accessToken\`)`);
    }

}
