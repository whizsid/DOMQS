// Query selecting type definitions and interfaces

// Attribute comparison types
export const FIND_ATTR_VALUE_EQUAL = 'FIND_ATTR_VALUE_EQUAL';
export const FIND_ATTR_VALUE_HAS = 'FIND_ATTR_VALUE_HAS';
export const FIND_ATTR_VALUE_CONTAINS = 'FIND_ATTR_VALUE_CONTAINS';
export const FIND_ATTR_VALUE_BEGIN = 'FIND_ATTR_VALUE_BEGIN';
export const FIND_ATTR_VALUE_END = 'FIND_ATTR_VALUE_END';
export const FIND_ATTR_VALUE_CONTAIN = 'FIND_ATTR_VALUE_CONTAIN';

export type FindComparison = typeof FIND_ATTR_VALUE_EQUAL |
    typeof FIND_ATTR_VALUE_HAS |
    typeof FIND_ATTR_VALUE_CONTAINS |
    typeof FIND_ATTR_VALUE_BEGIN |
    typeof FIND_ATTR_VALUE_END |
    typeof FIND_ATTR_VALUE_CONTAIN;

export interface FindAttribute {
    name:string;
    value:string|undefined;
    comparison: FindComparison;
}

// Element next level types
export const DOMQS_NEXT_LEVEL_CHILD = 'DOMQS_NEXT_LEVEL_CHILD';
export const DOMQS_NEXT_LEVEL_ADJ_SIBLING = 'DOMQS_NEXT_LEVEL_ADJ_SIBLING';
export const DOMQS_NEXT_LEVEL_GEN_SIBLING = 'DOMQS_NEXT_LEVEL_GEN_SIBLING';

export type FindNextLevel = typeof DOMQS_NEXT_LEVEL_ADJ_SIBLING |
    typeof DOMQS_NEXT_LEVEL_CHILD |
    typeof DOMQS_NEXT_LEVEL_GEN_SIBLING |
    undefined;

export interface FindElement {
    attributes:FindAttribute[];
    // nth child index (first child = 0,...,last child = -1)
    childrenIndex?:number;
    nextElementLevel?: FindNextLevel;
    name?:string;
}

// DOM parser type defintions
export interface Attribute {
    name:string;
    value?:string|boolean;
    startingAt:number;
    endingAt:number;
}

export interface Element {
    name:string;
    attributes:Attribute[];
    startTagStartingAt:number;
    startTagEndingAt:number;
    endTagStartingAt:number;
    endTagEndingAt:number;
    childrens:Element[];
    key:number;
    totalChildrens:number;
}

// Finder types
export const FOUND_SELECTION_ATTR = 'FOUND_SELECTION_ATTR';
export const FOUND_SELECTION_TAG = 'FOUND_SELECTION_TAG';

export type FoundSelectionType = typeof FOUND_SELECTION_ATTR | typeof FOUND_SELECTION_TAG;

export interface FoundSelection {
    startingAt:number;
    endingAt:number;
    type:FoundSelectionType;
}