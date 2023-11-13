import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1699876987437 implements MigrationInterface {
    name = ' $npmConfigName1699876987437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`userId\` int NOT NULL, \`postId\` int NOT NULL, \`comment\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`goalId\` int NOT NULL, \`userId\` int NOT NULL, UNIQUE INDEX \`IDX_780c70b2330b9e4e60b5bce0fb\` (\`goalId\`), UNIQUE INDEX \`REL_780c70b2330b9e4e60b5bce0fb\` (\`goalId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`socialId\` varchar(255) NOT NULL, \`socialType\` varchar(255) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`profileImage\` varchar(255) NOT NULL, \`OAuthRefreshToken\` varchar(255) NOT NULL, \`OAuthAccessToken\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NULL, \`accessToken\` varchar(255) NULL, UNIQUE INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\` (\`socialId\`), UNIQUE INDEX \`IDX_2aa6990897ff7ccb6ebe2b5db3\` (\`OAuthRefreshToken\`), UNIQUE INDEX \`IDX_0783516f68ea9354a75f53dd0b\` (\`OAuthAccessToken\`), UNIQUE INDEX \`IDX_03585d421deb10bbc326fffe4c\` (\`refreshToken\`), UNIQUE INDEX \`IDX_7b0580ed0bf7364a7d4d11d5b2\` (\`accessToken\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`video\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`video1\` varchar(255) NULL, \`video2\` varchar(255) NULL, \`video3\` varchar(255) NULL, \`finalVideo\` varchar(255) NULL, \`goalId\` int NOT NULL, UNIQUE INDEX \`IDX_67d06dd896fd35a1d28bf7b2dd\` (\`goalId\`), UNIQUE INDEX \`REL_67d06dd896fd35a1d28bf7b2dd\` (\`goalId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`goal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`isShare\` varchar(255) NOT NULL, \`day1\` varchar(255) NOT NULL, \`day2\` varchar(255) NOT NULL, \`day3\` varchar(255) NOT NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_5c1cf55c308037b5aca1038a131\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_780c70b2330b9e4e60b5bce0fbc\` FOREIGN KEY (\`goalId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`video\` ADD CONSTRAINT \`FK_67d06dd896fd35a1d28bf7b2dd8\` FOREIGN KEY (\`goalId\`) REFERENCES \`video\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`goal\` ADD CONSTRAINT \`FK_40bd308ea814964cec7146c6dce\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`goal\` DROP FOREIGN KEY \`FK_40bd308ea814964cec7146c6dce\``);
        await queryRunner.query(`ALTER TABLE \`video\` DROP FOREIGN KEY \`FK_67d06dd896fd35a1d28bf7b2dd8\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_780c70b2330b9e4e60b5bce0fbc\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_5c1cf55c308037b5aca1038a131\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``);
        await queryRunner.query(`DROP TABLE \`goal\``);
        await queryRunner.query(`DROP INDEX \`REL_67d06dd896fd35a1d28bf7b2dd\` ON \`video\``);
        await queryRunner.query(`DROP INDEX \`IDX_67d06dd896fd35a1d28bf7b2dd\` ON \`video\``);
        await queryRunner.query(`DROP TABLE \`video\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b0580ed0bf7364a7d4d11d5b2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_03585d421deb10bbc326fffe4c\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_0783516f68ea9354a75f53dd0b\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_2aa6990897ff7ccb6ebe2b5db3\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_9bd2fe7a8e694dedc4ec2f666f\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`REL_780c70b2330b9e4e60b5bce0fb\` ON \`post\``);
        await queryRunner.query(`DROP INDEX \`IDX_780c70b2330b9e4e60b5bce0fb\` ON \`post\``);
        await queryRunner.query(`DROP TABLE \`post\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
    }

}
