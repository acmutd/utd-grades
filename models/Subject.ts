import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Subject {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string
}
