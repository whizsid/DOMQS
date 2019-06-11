import { Attribute, Element } from "./types";

const domParser =  (txt:string,offset=0):Element[]=>{
    // Removing line breaks
    txt = txt.replace(/\r?\n|\r/g," ");

    const startTagRgxp = /\<(\w+)([^\>]+)(\>|\/\>)/g;

    let elements:Element[] = [];

    while(txt.match(startTagRgxp)){

        const matched = startTagRgxp.exec(txt);

        if(matched){
            let tag = matched[0];

            const startTagStartingAt = offset + txt.search(tag);
            const startTagEndingAt = startTagStartingAt + tag.length;
            
            let childrens:Element[] = [];
            let endTagStartingAt = startTagStartingAt;
            let endTagEndingAt = startTagEndingAt;
            let name = "";

            let attributes:Attribute[] = [];

            let matchedForName = /^\<(\w+)(.*)/g.exec(tag);
            let attrRegex = /(\w+)(\s+|)\=(\s+|)(\"(.*?)\"|\'(.*?)\')/g;

            if(matchedForName){
                name = matchedForName[1];

                let matchAttr:RegExpExecArray|null;

                while((matchAttr = attrRegex.exec(tag))!== null){

                    const startingAt = startTagStartingAt+tag.search(matchAttr[0]);

                    attributes.push({
                        name:matchAttr[1],
                        value:typeof matchAttr[5] ==='undefined'?matchAttr[6]:matchAttr[5],
                        startingAt,
                        endingAt:startingAt+matchAttr[0].length
                    });
                }

                if(tag.trim().substr(-2)!=='/>'){
                    const fullTagRegex = new RegExp("\<"+name+"([^\>]+|)\>(.*?)\<\/"+name+"(\\s+|)\>","g");

                    const fullTagMatched = fullTagRegex.exec(txt);

                    if(fullTagMatched){
                        endTagEndingAt = startTagStartingAt + fullTagMatched[0].length;
                        endTagStartingAt = endTagEndingAt - (3+name.length+fullTagMatched[3].length);
                        const innerText = fullTagMatched[2];
                        childrens = domParser(innerText,startTagEndingAt);
                    }
                }
                

                txt = txt.slice(0,startTagStartingAt-offset)+txt.slice(endTagEndingAt-offset);

            }

            elements.push({
                name,
                attributes,
                startTagStartingAt,
                startTagEndingAt,
                endTagStartingAt,
                endTagEndingAt,
                childrens
            });

            offset = endTagEndingAt;
        }
    }

    return elements;
};

export default domParser;