import { Element, FindElement, FIND_ATTR_VALUE_BEGIN, FIND_ATTR_VALUE_CONTAIN, FIND_ATTR_VALUE_END, FIND_ATTR_VALUE_EQUAL, FIND_ATTR_VALUE_CONTAINS, FIND_ATTR_VALUE_HAS, FoundSelection, DOMQS_NEXT_LEVEL_GEN_SIBLING, DOMQS_NEXT_LEVEL_ADJ_SIBLING, DOMQS_NEXT_LEVEL_CHILD } from "./types";

const match = (element: Element, findElement: FindElement): FoundSelection | null => {

    // Matching name if supplied
    if (typeof findElement.name !== 'undefined') {
        if (findElement.name !== element.name) {
            return null;
        }
    }

    // Matching children index if supplied
    if (typeof findElement.childrenIndex !== 'undefined') {
        if (findElement.childrenIndex === -1 && element.key !== element.totalChildrens - 1) {
            // When supplied index is the last index and key is not the last one
            return null;
        } else {
            // When key is not matching the supplied key
            if (findElement.childrenIndex !== element.key) {
                return null;
            }
        }
    }

    // When attributes length is not matching
    if (findElement.attributes.length > element.attributes.length) {
        return null;
    }

    // Create new selection
    let found: FoundSelection = {
        element: element,
        attributes: []
    };

    for (const findAttr of findElement.attributes) {
        for (const attr of element.attributes) {

            if (attr.name === findAttr.name) {
                let matched = true;
                // When both attributes has an value
                if (typeof attr.value !== 'undefined' && typeof findAttr.value !== 'undefined') {

                    switch (findAttr.comparison) {
                        case FIND_ATTR_VALUE_BEGIN:
                            matched = attr.value.toString().search(findAttr.value) === 0;
                            break;
                        case FIND_ATTR_VALUE_CONTAIN:
                            matched = attr.value.toString().search(findAttr.value) >= 0;
                            break;
                        case FIND_ATTR_VALUE_CONTAINS:
                            matched = attr.value.toString().search(new RegExp("(^|\\s)" + findAttr.value + "(\\s|$)", "g")) >= 0;
                            break;
                        case FIND_ATTR_VALUE_END:
                            matched = attr.value.toString().search(findAttr.value) + findAttr.value.length === attr.value.toString().length;
                            break;
                        case FIND_ATTR_VALUE_EQUAL:
                            matched = attr.value === findAttr.value;
                            break;
                        default:
                            break;
                    }

                } else if (findAttr.comparison !== FIND_ATTR_VALUE_HAS) {
                    return null;
                }

                if (matched) {
                    found.attributes.push(attr);
                } else {
                    return null;
                }
            }
        }
    }

    return found;

};


const finder = (document: Element[], term: FindElement[], parent:FoundSelection|undefined=undefined, currentLevel: number = 0): FoundSelection[] => {
    
    let selections:FoundSelection[] = [];
    const currentFindElement = term[currentLevel];
    const prevFindElement = currentLevel>0?term[currentLevel-1]:null;

    for(const el of document){
        const matched = match(el,currentFindElement);

        if(matched){
            matched.parent = parent;

            switch (currentFindElement.nextElementLevel) {
                case DOMQS_NEXT_LEVEL_CHILD:
                    selections =[...selections,...finder(el.childrens,term,matched,currentLevel+1)];
                    break;
                case DOMQS_NEXT_LEVEL_ADJ_SIBLING:
                    if(typeof document[el.key+1]!=='undefined'){
                        selections =[...selections,...finder([document[el.key+1]],term,matched,currentLevel+1)];
                    }
                    break;
                case DOMQS_NEXT_LEVEL_GEN_SIBLING:
                    if(el.key!==document.length-1){
                        selections =[...selections,...finder(document.slice(el.key+1),term,matched,currentLevel+1)];
                    }
                    break;
                default:
                    selections = [...selections,matched];
                    break;
            }
        } else {
            if(prevFindElement){
                if(prevFindElement.nextElementLevel===DOMQS_NEXT_LEVEL_CHILD){
                    selections = [...selections,...finder(el.childrens,term,parent,currentLevel)];
                } else {
                    selections = [...selections,...finder([el],term)];
                }
            }
        }

        selections = [...selections,...finder(el.childrens,term)];
        
    }

    return selections;
};

export default finder;