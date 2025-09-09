
export interface SubmissionForTeacherDto {
  submissionId: string;
  assignmentId: string;
  assignmentTitle: string;
  courseName: string;
  studentId: string;
  studentName: string;
  regNumber: string;
  submittedAt: string;
  writtenSubmission?: string;
  fileId?: string;
  fileName?: string;
  contentType?: string;
  score?: number;
  feedback?: string;
}