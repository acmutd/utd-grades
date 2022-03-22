import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Semester {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string
}
