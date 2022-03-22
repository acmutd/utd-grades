import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export default class CatalogNumber {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string
}
