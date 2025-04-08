import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, } from "typeorm";

@Entity("view_history")
export class ViewHistory {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @Column({ type: 'varchar', nullable: true })
    character!: string;

    @CreateDateColumn({ name: "visited_at" })
    visitedAt!: Date;

}