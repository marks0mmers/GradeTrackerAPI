export class Course {
    constructor(
        private title: string,
        private description: string,
        private section: number,
        private creditHours: number,
        private userId: string,
        private id?: string
    ) {}

    get getTitle() {
        return this.title;
    }

    get getDescription() {
        return this.description;
    }

    get getSection() {
        return this.section;
    }

    get getCreditHours() {
        return this.creditHours;
    }

    get getUserId() {
        return this.userId;
    }

    get getId() {
        return this.id;
    }
}
