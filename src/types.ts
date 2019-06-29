export interface FoundSelection {
    start:number;
    end:number;
}

export interface CommandCollection {
    [key:string]:()=>void;
}

/* I have modified cheerio type definitions. Because
   cheerio is not supporting domhandler types currently.
*/
export interface ModCheerioElement extends CheerioElement {
    startIndex:number;
    endIndex:number;
}

export interface ModCheerio extends Cheerio {
    each(func: (index: number, element: ModCheerioElement) => any): ModCheerio;
}