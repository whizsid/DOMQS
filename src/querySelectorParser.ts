import { FindAttribute, FIND_ATTR_VALUE_EQUAL, FIND_ATTR_VALUE_CONTAINS, FIND_ATTR_VALUE_LANG, FIND_ATTR_VALUE_BEGIN, FIND_ATTR_VALUE_END, FIND_ATTR_VALUE_CONTAIN, FIND_ATTR_VALUE_HAS, FindComparison, FindNextLevel, DOMQS_NEXT_LEVEL_CHILD, DOMQS_NEXT_LEVEL_GEN_SIBLING, DOMQS_NEXT_LEVEL_ADJ_SIBLING, FindElement } from "./types";

/**
 * Resolve attributes in the HTML tag
 * @param el HTML tag string
 */
const resolveElementAttributes = (el:string):FindAttribute[]=>{
    let attributes:FindAttribute[] = [];

    // Matching classes
    const classes = el.match(/\.([^\[\.\:\,\#]+)/g);

    // Adding classes as html attributes
    // So we don't want to search classes separately
    if(classes){
        for (const attrClass of classes) {
            attributes.push({
                name:"class",
                value:attrClass.slice(1),
                // Class attribute can contains more classes than this class
                comparison:FIND_ATTR_VALUE_CONTAINS
            });
        }
    }

    // Matching ids
    const ids = el.match(/\#([^\[\.\:\,\#]+)/g);

    if(ids){
        for (const id of ids){
            attributes.push({
                name:"id",
                value:id,
                comparison:FIND_ATTR_VALUE_EQUAL
            });
        }
    }

    // Regex for matching attributes
    const attrRegex = /\[(\w+)(\=|\~\=|\|\=|\^\=|\$\=|\*\=)\'([^\']+)\'\]/g;

    // Getting matched attributes
    const attrs = el.match(attrRegex);

    if(attrs){
        for (const attr of attrs){
            const matched = attrRegex.exec(attr);

            if(matched){

                let comparison:FindComparison;
                // Resolving the comparison type
                switch (matched[2]) {
                    case "=":
                        comparison = FIND_ATTR_VALUE_EQUAL;
                        break;
                    case "=~":
                        comparison = FIND_ATTR_VALUE_CONTAINS;
                        break;
                    case "|=":
                        comparison = FIND_ATTR_VALUE_LANG;
                        break;
                    case "^=":
                        comparison = FIND_ATTR_VALUE_BEGIN;
                        break;
                    case "$=":
                        comparison = FIND_ATTR_VALUE_END;
                        break;
                    case "*=":
                        comparison = FIND_ATTR_VALUE_CONTAIN;
                        break;
                    default:
                        comparison = FIND_ATTR_VALUE_HAS;
                }

                attributes.push({
                    name:matched[1],
                    comparison,
                    value:matched[3]
                });
            }
        }
    }

    return attributes;
};

/**
 * Resolving the element name by html tag
 * @param el HTML tag
 */
const resolveElementName = (el:string):string|undefined=>{
    // Regex for search the tag name
    const reg = /\b(\w+)(.*)/g;

    const matched = reg.exec(el);

    if(!matched){
        return undefined;
    }

    return matched[1];
};

/**
 * Parsing elements by a query selector
 */
export default(qs:string):FindElement[]=>{

    // Removing unwanted spaces from query selector
    qs = qs.replace(/(\s+)/g," ").replace(/\s(\~|\+|\>)/g,"$1").replace(/(\~|\+|\>)\s/g,"$1");

    // Spliting by combinators
    const splited = qs.split(/(\~|\+|\>|\s)/g);

    let elements:FindElement[] = [];

    // Looping over parts of the query selector
    for (let index = 0; index < splited.length; index=index+2) {

        // Query selector part
        const attributesString = splited[index];

        // Next part combination
        const nextLevelString = splited[index+1];

        let nextLevel:FindNextLevel;

        // Resolving attributes and the name
        const attributes = resolveElementAttributes(attributesString);
        const name = resolveElementName(attributesString);

        // Resolving next element level
        switch (nextLevelString) {
            case " ":
                nextLevel = DOMQS_NEXT_LEVEL_CHILD;
                break;
            case ">":
                nextLevel = DOMQS_NEXT_LEVEL_CHILD;
                break;
            case "~":
                nextLevel = DOMQS_NEXT_LEVEL_GEN_SIBLING;
                break;
            case "+":
                nextLevel = DOMQS_NEXT_LEVEL_ADJ_SIBLING;
                break;
            default:
                nextLevel = undefined;
                break;
        }

        const childElement = {
            attributes,
            nextElementLevel:nextLevel,
            name
        };

        elements.push(childElement);
    }

    return elements;

};