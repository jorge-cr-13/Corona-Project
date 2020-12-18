export class News{
    date: Date;
    title: string;
    url: string;

    constructor(date: Date,
        title: string,
        url: string){
            this.date = date;
            this.title = title;
            this.url = url;
        }
}
