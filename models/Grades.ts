import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import CatalogNumber from "./CatalogNumber";
import Professor from "./Professor";
import Section from "./Section";
import Semester from "./Semester";
import Subject from "./Subject";

@Entity()
export default class Grades {
  @Column({ nullable: false })
  @OneToOne(() => Semester)
  @JoinColumn()
  semester: Semester

  @Column({ nullable: false })
  @OneToOne(() => Subject)
  @JoinColumn()
  subject: Subject

  @Column({ nullable: false })
  @OneToOne(() => CatalogNumber)
  @JoinColumn()
  catalogNumber: CatalogNumber

  @Column({ nullable: false })
  @OneToOne(() => Section)
  @JoinColumn()
  section: Section

  @Column({ nullable: false })
  aPlus: number

  @Column({ nullable: false })
  a: number

  @Column({ nullable: false })
  aMinus: number

  @Column({ nullable: false })
  bPlus: number

  @Column({ nullable: false })
  b: number

  @Column({ nullable: false })
  bMinus: number

  @Column({ nullable: false })
  cPlus: number

  @Column({ nullable: false })
  c: number

  @Column({ nullable: false })
  cMinus: number

  @Column({ nullable: false })
  dPlus: number

  @Column({ nullable: false })
  d: number

  @Column({ nullable: false })
  dMinus: number

  @Column({ nullable: false })
  f: number

  @Column({ nullable: false })
  cr: number

  @Column({ nullable: false })
  nc: number

  @Column({ nullable: false })
  p: number

  @Column({ nullable: false })
  w: number

  @Column({ nullable: false })
  i: number

  @Column({ nullable: false })
  nf: number

  @Column({ nullable: false })
  @OneToOne(() => Professor)
  @JoinColumn()
  instructor1: Professor

  @Column({ nullable: false })
  @OneToOne(() => Professor)
  @JoinColumn()
  instructor2: Professor

  @Column({ nullable: false })
  @OneToOne(() => Professor)
  @JoinColumn()
  instructor3: Professor

  @Column({ nullable: false })
  @OneToOne(() => Professor)
  @JoinColumn()
  instructor4: Professor

  @Column({ nullable: false })
  @OneToOne(() => Professor)
  @JoinColumn()
  instructor5: Professor

  @Column({ nullable: false })
  @OneToOne(() => Professor)
  @JoinColumn()
  instructor6: Professor
}
