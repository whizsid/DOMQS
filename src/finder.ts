import { Element, FindElement, FIND_ATTR_VALUE_BEGIN, FIND_ATTR_VALUE_CONTAIN, FIND_ATTR_VALUE_END, FIND_ATTR_VALUE_EQUAL, FIND_ATTR_VALUE_CONTAINS, FIND_ATTR_VALUE_HAS, FoundSelection } from "./types";

const match = (element:Element,findElement:FindElement)=>{
    let matched = true;

    // Matching name if supplied
    if(typeof findElement.name!=='undefined'){
        matched = findElement.name === element.name;
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
                                matched = attr.value.toString().search(new RegExp("\\b"+findAttr.value+"\\b","g"))>=0;
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
            }
        }
    }

    return matched;

};

const finder = (document:Element[],term:FindElement[],currentLevel:number=0):FoundSelection[]=>{

    const currentFindElement = term[currentLevel];
    const selections:FoundSelection[] = [];

    for(const element of document){
        const matched = match(element,currentFindElement);

        if(matched){
            
        }
    }

    if(typeof term[currentLevel].nextElementLevel!=='undefined'){
        
    }


    return selections;

};