/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Ticker = {
	id: string;
	moduleId: string;
	name: string;
	description: string;
	data:
		| {
				[k: string]: unknown;
		  }
		| unknown[]
		| string
		| number
		| boolean
		| null;
}[];
