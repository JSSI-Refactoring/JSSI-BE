import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1701066212543 implements MigrationInterface {
    name = ' $npmConfigName1701066212543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`socialId\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`socialId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\` (\`socialId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`socialId\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`socialId\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\` ON \`user\` (\`socialId\`)`);
    }

}
