import { FindAttribute, FIND_ATTR_VALUE_EQUAL, FIND_ATTR_VALUE_CONTAINS, FIND_ATTR_VALUE_LANG, FIND_ATTR_VALUE_BEGIN, FIND_ATTR_VALUE_END, FIND_ATTR_VALUE_CONTAIN, FIND_ATTR_VALUE_HAS, FindComparison } from "./types";

const resolveElementAttributes = (el:string):FindAttribute[]=>{
    let attributes:FindAttribute[] = [];

    const classes = el.match(/\.([^\[\.\:\,\#]+)/g);

    if(classes){
        for (const attrClass of classes) {
            attributes.push({
                name:"class",
                value:attrClass,
                comparison:FIND_ATTR_VALUE_CONTAINS
            });
        }
    }

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

    const attrRegex = /\[(\w+)(\=|\~\=|\|\=|\^\=|\$\=|\*\=)\'([^\']+)\'\]/g;

    const attrs = el.match(attrRegex);

    if(attrs){
        for (const attr of attrs){
            const matched = attrRegex.exec(attr);

            if(matched){

                let comparison:FindComparison;

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

export default(qs:string):void=>{

    // Removing unwanted spaces from query selector
    qs = qs.replace(/(\s+)/g," ").replace(/\s(\~|\+|\>)/g,"$1").replace(/(\~|\+|\>)\s/g,"$1");

    // Spliting by combinators
    const splited = qs.split(/(\~|\+|\>|\s)/g);

    for (let index = 0; index < splited.length; index=index+2) {
        const attributesString = splited[index];
        const nextLevelString = splited[index+1];

        const attributes = resolveElementAttributes(attributesString);
        
        
    }


};