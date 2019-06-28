export interface FoundSelection {
    start:number;
    end:number;
}

export interface CommandCollection {
    [key:string]:()=>void;
}

export interface ModCheerioElement extends CheerioElement {
    startIndex:number;
    html:()=>string;
}

export interface ModCheerio extends Cheerio {
    each(func: (index: number, element: ModCheerioElement) => any): ModCheerio;
    toArray:()=>ModCheerioElement[];
    [index: number]: ModCheerioElement;
}