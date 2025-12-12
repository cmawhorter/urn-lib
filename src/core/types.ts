// NOTE: at this time this seems like it'll be unnecessary

// /**
//  * Core type definitions for URN library
//  * Provides branded types for compile-time safety
//  */

// const kInternalTypeBrand = Symbol('____DO_NOT_USE__internal_type_brand____');

// /**
//  * Branded types for compile-time safety
//  *
//  * Note that the property is never actually set and is instead forced i.e. this is a type only thing
//  */
// export type Branded<T, ID extends string> = T & { [kInternalTypeBrand]: ID };
