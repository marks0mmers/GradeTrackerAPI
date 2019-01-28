export class GradeCategory {
    constructor(
        public title: string,
        public percentage: number,
        public numberOfGrades: number,
        public userId: string,
        public courseId: string,
        public id?: string,
        public remainingGrades?: number,
        public currentAverage?: number,
        public guarenteedAverage?: number,
        public potentialAverage?: number
    ) {}
}
