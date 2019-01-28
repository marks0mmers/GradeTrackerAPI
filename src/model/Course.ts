export class Course {
    constructor(
        public title: string,
        public description: string,
        public section: number,
        public creditHours: number,
        public userId: string,
        public id?: string
    ) {}
}
