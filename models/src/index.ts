import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"

@Entity()
export class CatalogNumber {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false, unique: true })
  name: string

  constructor(name: string) {
    this.name = name;
  }
}

@Entity()
export class Professor {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  first: string

  @Column({ nullable: false })
  last: string

  constructor(first: string, last: string) {
    this.first = first;
    this.last = last;
  }
}

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false, unique: true })
  name: string

  constructor(name: string) {
    this.name = name;
  }
}

@Entity()
export class Semester {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false, unique: true })
  name: string

  constructor(name: string) {
    this.name = name;
  }
}


@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: false, unique: true })
  name: string

  constructor(name: string) {
    this.name = name;
  }
}

@Entity()
export class Grades {

  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Semester, { nullable: false, cascade: true })
  semester!: Semester

  @ManyToOne(() => Subject, { nullable: false, cascade: true })
  subject!: Subject

  @ManyToOne(() => CatalogNumber, { nullable: false, cascade: true })
  catalogNumber!: CatalogNumber

  @ManyToOne(() => Section, { nullable: false, cascade: true })
  section!: Section

  @Column({ nullable: false })
  aPlus!: number

  @Column({ nullable: false })
  a!: number

  @Column({ nullable: false })
  aMinus!: number

  @Column({ nullable: false })
  bPlus!: number

  @Column({ nullable: false })
  b!: number

  @Column({ nullable: false })
  bMinus!: number

  @Column({ nullable: false })
  cPlus!: number

  @Column({ nullable: false })
  c!: number

  @Column({ nullable: false })
  cMinus!: number

  @Column({ nullable: false })
  dPlus!: number

  @Column({ nullable: false })
  d!: number

  @Column({ nullable: false })
  dMinus!: number

  @Column({ nullable: false })
  f!: number

  @Column({ nullable: false })
  cr!: number

  @Column({ nullable: false })
  nc!: number

  @Column({ nullable: false })
  p!: number

  @Column({ nullable: false })
  w!: number

  @Column({ nullable: false })
  i!: number

  @Column({ nullable: false })
  nf!: number

  @ManyToOne(() => Professor, { cascade: true })
  instructor1!: Professor

  @ManyToOne(() => Professor, { cascade: true })
  instructor2!: Professor

  @ManyToOne(() => Professor, { cascade: true })
  instructor3!: Professor

  @ManyToOne(() => Professor, { cascade: true })
  instructor4!: Professor

  @ManyToOne(() => Professor, { cascade: true })
  instructor5!: Professor

  @ManyToOne(() => Professor, { cascade: true })
  instructor6!: Professor
}
