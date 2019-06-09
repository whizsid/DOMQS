export const FIND_ATTR_VALUE_EQUAL = 'FIND_ATTR_VALUE_EQUAL';
export const FIND_ATTR_VALUE_HAS = 'FIND_ATTR_VALUE_HAS';
export const FIND_ATTR_VALUE_CONTAINS = 'FIND_ATTR_VALUE_CONTAINS';
export const FIND_ATTR_VALUE_LANG = 'FIND_ATTR_VALUE_LANG';
export const FIND_ATTR_VALUE_BEGIN = 'FIND_ATTR_VALUE_BEGIN';
export const FIND_ATTR_VALUE_END = 'FIND_ATTR_VALUE_END';
export const FIND_ATTR_VALUE_CONTAIN = 'FIND_ATTR_VALUE_CONTAIN';

export type FindComparison = typeof FIND_ATTR_VALUE_EQUAL |
    typeof FIND_ATTR_VALUE_HAS |
    typeof FIND_ATTR_VALUE_CONTAINS |
    typeof FIND_ATTR_VALUE_LANG |
    typeof FIND_ATTR_VALUE_BEGIN |
    typeof FIND_ATTR_VALUE_END |
    typeof FIND_ATTR_VALUE_CONTAIN;

export interface FindAttribute {
    name:string;
    value:string|undefined;
    comparison: FindComparison;
}

export const DOMQS_NEXT_LEVEL_CHILD = 'DOMQS_NEXT_LEVEL_CHILD';
export const DOMQS_NEXT_LEVEL_ADJ_SIBLING = 'DOMQS_NEXT_LEVEL_ADJ_SIBLING';
export const DOMQS_NEXT_LEVEL_GEN_SIBLING = 'DOMQS_NEXT_LEVEL_GEN_SIBLING';

export type FindNextLevel = typeof DOMQS_NEXT_LEVEL_ADJ_SIBLING |
    typeof DOMQS_NEXT_LEVEL_CHILD |
    typeof DOMQS_NEXT_LEVEL_GEN_SIBLING;

export interface FindElement {
    attributes:FindAttribute[];
    // nth child index (first child = 0,...,last child = -1)
    childrenIndex?:number;
    nextElement?:FindElement;
    nextElementLevel?: FindNextLevel;
        
}