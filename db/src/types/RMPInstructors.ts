export interface RMPInstructor {
  name: string;
  rmp_id: string | null;
  url: string | null;
  instructor_id: string;
  quality_rating: number | null;
  difficulty_rating: number | null;
  would_take_again: number | null;
  ratings_count: number | null;
  tags: string | null;
  course_ratings: string | null;
  overall_grade_rating: number | null;
  total_grade_count: number | null;
}

export interface RMPCourseRating {
  instructor_name: string;
  instructor_id: string;
  course_code: string;
  rating: string;
}
