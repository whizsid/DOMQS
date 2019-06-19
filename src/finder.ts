import { Element, FindElement, FIND_ATTR_VALUE_BEGIN, FIND_ATTR_VALUE_CONTAIN, FIND_ATTR_VALUE_END, FIND_ATTR_VALUE_EQUAL, FIND_ATTR_VALUE_CONTAINS, FIND_ATTR_VALUE_HAS, FoundSelection, DOMQS_NEXT_LEVEL_GEN_SIBLING, FOUND_SELECTION_TAG, FOUND_SELECTION_ATTR, DOMQS_NEXT_LEVEL_ADJ_SIBLING, DOMQS_NEXT_LEVEL_CHILD } from "./types";

const match = (element:Element,findElement:FindElement):FoundSelection[]|null=>{
    let matched = true;
    let selections:FoundSelection[] = [];

    // Matching name if supplied
    if(typeof findElement.name!=='undefined'){
        matched = findElement.name === element.name;
        selections.push({
            type:FOUND_SELECTION_ATTR,
            startingAt:element.startTagStartingAt+1,
            endingAt:element.startTagStartingAt +1 + element.name.length
        });
    }

    // Matching children index if supplied
    if(matched&&typeof findElement.childrenIndex!=='undefined'){
        if(findElement.childrenIndex===-1&&element.key!==element.totalChildrens-1){
            // When supplied index is the last index and key is not the last one
            matched = false;
        } else {
            // When key is not matching the supplied key
            matched = findElement.childrenIndex === element.key;
        }
    }

    for(const findAttr of findElement.attributes){
        for(const attr of element.attributes){

            if(attr.name===findAttr.name && matched){
                // When both attributes has an value
                if(typeof attr.value !=='undefined'&&typeof findAttr.value!=='undefined'){

                    switch (findAttr.comparison) {
                        case FIND_ATTR_VALUE_BEGIN:
                                matched = attr.value.toString().search(findAttr.value)===0;
                            break;
                        case FIND_ATTR_VALUE_CONTAIN:
                                matched = attr.value.toString().search(findAttr.value)>=0;
                            break;
                        case FIND_ATTR_VALUE_CONTAINS:
                                matched = attr.value.toString().search(new RegExp("(^|\\s)"+findAttr.value+"(\\s|$)","g"))>=0;
                            break;
                        case FIND_ATTR_VALUE_END:
                                matched = attr.value.toString().search(findAttr.value)+findAttr.value.length===attr.value.toString().length;
                            break;
                        case FIND_ATTR_VALUE_EQUAL:
                                matched = attr.value === findAttr.value;
                            break;
                        default:
                            break;
                    }

                } else if(findAttr.comparison!==FIND_ATTR_VALUE_HAS){
                    matched=false;
                }

                if(matched){
                    selections.push({
                        type:FOUND_SELECTION_ATTR,
                        startingAt:attr.startingAt,
                        endingAt:attr.endingAt
                    });
                }
            }
        }
    }

    return matched?selections:null;

};

const finder = (document:Element[],term:FindElement[],currentLevel:number=0,childCheck=false):FoundSelection[]|null=>{

    const currentFindElement = term[currentLevel];
    let selections:FoundSelection[] = [];
    let matched:FoundSelection[]|null = [];

    let nextLevel:string|undefined = currentFindElement.nextElementLevel;

    for (let index = 0; index < document.length; index++) {
        const element = document[index];

        matched = match(element,currentFindElement);

        if(matched){
            let found:FoundSelection[]|null; 
            switch (nextLevel) {
                case DOMQS_NEXT_LEVEL_GEN_SIBLING:
                        found = finder(document.slice(index+1),term,currentLevel+1);
                    break;
                case DOMQS_NEXT_LEVEL_ADJ_SIBLING:
                        found = finder([document[index+1]],term,currentLevel+1);
                    break;   
                case DOMQS_NEXT_LEVEL_CHILD:
                        found = finder(element.childrens,term,currentLevel+1,true);
                    break;
                default:
                        found = [{
                            type:FOUND_SELECTION_TAG,
                            startingAt:element.startTagStartingAt,
                            endingAt:element.endTagEndingAt
                        }];
                    break;
            }

            if(found){
                matched = matched.concat(found);
            }

        } else if(typeof nextLevel ==='undefined'){
            matched = null;
        } else{
            if(match(element,term[0])){
                childCheck = false;
            }
            matched = finder(element.childrens,term,childCheck?currentLevel:0);
        } 

        if(matched){
            selections = selections.concat(matched);
        }
    }

    return selections.length?selections:null;

};

export default finder;