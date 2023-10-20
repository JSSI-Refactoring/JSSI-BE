import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1697781890109 implements MigrationInterface {
    name = ' $npmConfigName1697781890109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Video\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`video1\` varchar(255) NULL, \`video2\` varchar(255) NULL, \`video3\` varchar(255) NULL, \`finalVideo\` varchar(255) NULL, \`goalId\` int NOT NULL, UNIQUE INDEX \`IDX_c2bc21f979e874d9b8e3062845\` (\`goalId\`), UNIQUE INDEX \`REL_c2bc21f979e874d9b8e3062845\` (\`goalId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`userId\` int NOT NULL, \`postId\` int NOT NULL, \`comment\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`goalId\` int NOT NULL, \`userId\` int NOT NULL, UNIQUE INDEX \`IDX_8f0034cb22cfef2667c0a8daff\` (\`goalId\`), UNIQUE INDEX \`REL_8f0034cb22cfef2667c0a8daff\` (\`goalId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Goal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`isShare\` varchar(255) NOT NULL, \`day1\` varchar(255) NOT NULL, \`day2\` varchar(255) NOT NULL, \`day3\` varchar(255) NOT NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`socialId\` varchar(255) NOT NULL, \`socialType\` varchar(255) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`profileImage\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_733841fcf287be81bce091f6e2\` (\`socialId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Video\` ADD CONSTRAINT \`FK_c2bc21f979e874d9b8e3062845a\` FOREIGN KEY (\`goalId\`) REFERENCES \`Video\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comment\` ADD CONSTRAINT \`FK_4c827119c9554affb8018d4da82\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Comment\` ADD CONSTRAINT \`FK_fb770b565e79f3a4a2ecef894a7\` FOREIGN KEY (\`postId\`) REFERENCES \`Post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_97e81bcb59530bfb061e48aee6a\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_8f0034cb22cfef2667c0a8daffb\` FOREIGN KEY (\`goalId\`) REFERENCES \`Post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Goal\` ADD CONSTRAINT \`FK_5e913410e9f853b7e8237820e48\` FOREIGN KEY (\`userId\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Goal\` DROP FOREIGN KEY \`FK_5e913410e9f853b7e8237820e48\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_8f0034cb22cfef2667c0a8daffb\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_97e81bcb59530bfb061e48aee6a\``);
        await queryRunner.query(`ALTER TABLE \`Comment\` DROP FOREIGN KEY \`FK_fb770b565e79f3a4a2ecef894a7\``);
        await queryRunner.query(`ALTER TABLE \`Comment\` DROP FOREIGN KEY \`FK_4c827119c9554affb8018d4da82\``);
        await queryRunner.query(`ALTER TABLE \`Video\` DROP FOREIGN KEY \`FK_c2bc21f979e874d9b8e3062845a\``);
        await queryRunner.query(`DROP INDEX \`IDX_733841fcf287be81bce091f6e2\` ON \`User\``);
        await queryRunner.query(`DROP TABLE \`User\``);
        await queryRunner.query(`DROP TABLE \`Goal\``);
        await queryRunner.query(`DROP INDEX \`REL_8f0034cb22cfef2667c0a8daff\` ON \`Post\``);
        await queryRunner.query(`DROP INDEX \`IDX_8f0034cb22cfef2667c0a8daff\` ON \`Post\``);
        await queryRunner.query(`DROP TABLE \`Post\``);
        await queryRunner.query(`DROP TABLE \`Comment\``);
        await queryRunner.query(`DROP INDEX \`REL_c2bc21f979e874d9b8e3062845\` ON \`Video\``);
        await queryRunner.query(`DROP INDEX \`IDX_c2bc21f979e874d9b8e3062845\` ON \`Video\``);
        await queryRunner.query(`DROP TABLE \`Video\``);
    }

}
