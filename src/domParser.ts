import { Attribute, Element } from "./types";

/**
 * Parsing a HTML string to elements;.
 * 
 * @param txt
 * @param offset 
 */
const domParser =  (txt:string,offset=0):Element[]=>{

    // Removing line breaks
    txt = txt.replace(/\r?\n|\r/g," ");

    // Regex to search for start tags
    const startTagRgxp = /\<(\w+)([^\>]+)(\>|\/\>)/g;

    // Childrens storing in this array
    let elements:Element[] = [];

    while(txt.match(startTagRgxp)){

        // Getting matched groups
        const matched = startTagRgxp.exec(txt);

        if(matched){
            // Full tag
            let tag = matched[0];

            // Name of the tag
            let name = "";

            // Childrens of the HTML node
            let childrens:Element[] = [];

            // HTML attributes
            let attributes:Attribute[] = [];

            // String offsets for
            const startTagStartingAt = offset + txt.search(tag);
            const startTagEndingAt = startTagStartingAt + tag.length;
            let endTagStartingAt = startTagStartingAt;
            let endTagEndingAt = startTagEndingAt;

            // Getting the name of the tag
            let matchedForName = /^\<(\w+)(.*)/g.exec(tag);

            // Regex for getting attributes of the tag
            let attrRegex = /(\w+)(\s+|)\=(\s+|)(\"(.*?)\"|\'(.*?)\')/g;

            if(matchedForName){
                name = matchedForName[1];

                let matchAttr:RegExpExecArray|null;

                // Getting attributes and pushing it to attributes array
                while((matchAttr = attrRegex.exec(tag))!== null){

                    const startingAt = startTagStartingAt+tag.search(matchAttr[0]);

                    attributes.push({
                        name:matchAttr[1],
                        value:typeof matchAttr[5] ==='undefined'?matchAttr[6]:matchAttr[5],
                        startingAt,
                        endingAt:startingAt+matchAttr[0].length
                    });
                }

                // If the tag is not self closing
                if(tag.trim().substr(-2)!=='/>'){

                    // Regex for find the full HTML tag
                    const fullTagRegex = new RegExp("\<"+name+"([^\>]+|)\>(.*?)\<\/"+name+"(\\s+|)\>","g");

                    const fullTagMatched = fullTagRegex.exec(txt);

                    if(fullTagMatched){

                        // fullTagMatched[0] is the full string of the tag
                        endTagEndingAt = startTagStartingAt + fullTagMatched[0].length;

                        // 3 is the reserved length for the tag characters (for </ and >)
                        // fullTagMatched[3] is the space after name in closing tag
                        endTagStartingAt = endTagEndingAt - (3+name.length+fullTagMatched[3].length);

                        const innerText = fullTagMatched[2];

                        // Parsing inner text as HTML elements
                        // We are parsing the index of start tag ending position
                        // Because we want to add it to over chidrens positions
                        childrens = domParser(innerText,startTagEndingAt);
                    }
                }
                
                // Removing parsed text string from the string
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

            // Adding length of the current tag to the starting offset
            offset = endTagEndingAt;
        }
    }

    return elements;
};

export default domParser;