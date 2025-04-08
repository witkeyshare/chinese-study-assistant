import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";


@Entity("characters")
export class Character {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', unique: true })
  character!: string;

  @Column({ type: 'varchar', nullable: true })
  pinyin!: string;

  @Column({ type: 'varchar', nullable: true })
  radical!: string;

  @Column({ type: 'numeric', nullable: true })
  strokes!: number;

  @Column({ type: "json", nullable: true })
  meaning: any;

  @Column({ type: "json", nullable: true })
  words: any;

  @Column({ type: "json", nullable: true })
  similar: any;

  @CreateDateColumn({ name: "added_at" })
  addedAt!: Date;

}