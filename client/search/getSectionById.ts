import { DataSource } from 'typeorm';
import { Grades } from 'utd-grades-models';

export default async function getSectionById(
  id: number,
  con: DataSource
): Promise<Grades | null> {
  return await con
    .getRepository(Grades)
    .createQueryBuilder('grades')
    .where({ id })
    .innerJoinAndSelect('grades.section', 'section')
    .innerJoinAndSelect('grades.instructor1', 'professor')
    .innerJoinAndSelect('grades.catalogNumber', 'catalogNumber')
    .innerJoinAndSelect('grades.subject', 'subject')
    .innerJoinAndSelect('grades.semester', 'semester')
    .getOne();
}
