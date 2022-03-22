import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Section {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string
}
