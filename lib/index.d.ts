interface IDropDetails {
    files: FileList;
    links: string[];
    images: string[];
    text: string;
    html: string;
}
declare module 'dnd-details' {
    function getDetails(event: any): IDropDetails;
    export = getDetails;
}
