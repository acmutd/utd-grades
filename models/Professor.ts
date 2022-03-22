import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Professor {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string
}
