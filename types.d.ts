// ======== 1. OA Merge Configuration Types ========

export interface OamergeConfigurationInput {
	/**
	 * The relative directory to scan.
	 */
	dir: string;
	/**
	 * The file extension prefix to use. (Default: "@")
	 */
	ext?: string;
	/**
	 * The API prefix to use. (Default: "/")
	 */
	api?: string;
}
export interface OamergeConfiguration {
	/**
	 * Setting the current working directory will change the path resolution for
	 * generated output files. If not set, process.cwd() is used.
	 */
	cwd?: string;
	/**
	 * If set to a truthy value, the oamerge process will stay running, and will
	 * watch the configuration file and all input files for changes, re-running
	 * the compile process.
	 */
	watch?: boolean;
	/**
	 * The inputs will be normalized to an array of OamergeConfigurationInput objects.
	 */
	inputs: string | (string | OamergeConfigurationInput)[];
	/**
	 * Used as a prefix folder path for the generated output files.
	 */
	output: string;
	/**
	 * Override file loading behaviour, to support loading different file types.
	 */
	loaders?: string | (string | OamergeLoaderPlugin)[];
	/**
	 * Given an OamergeTree object, output a OamergeOutput object to be written to disk.
	 */
	generators?: string | (string | OamergeGeneratorPlugin)[];
}


// ======== 2. File Loader Plugin Types ========

/**
 * Given the path components for a file lookup, the loader is responsible for
 * opening a file and returning values that are relevant to OA Merge. E.g. from a
 * JavaScript file it would be the exported objects, while from a Markdown file it
 * might be the raw Markdown string.
 */
export interface OamergeLoaderParameters {
	cwd: string;
	inputDirectory: string;
	filepath: string;
}
export type OamergeLoaderPlugin = (params: OamergeLoaderParameters) => Promise<unknown>;


// ======== 3. Generator Plugin Types ========

/**
 * The tree inputs object contains the normalized input properties, and a
 * map of the filtered files in the input directory to their loaded content.
 */
export interface OamergeTreeInputs {
	/**
	 * The relative directory to scan.
	 */
	dir: string;
	/**
	 * The file extension prefix to use.
	 */
	ext: string;
	/**
	 * The API prefix to use, e.g. "/v1".
	 */
	api: string;
	files: {
		/**
		 * For example "paths/hello/world/get.@.js"
		 */
		[filepath: string]: {
			/**
			 * The filepath separated list, minus the `api` suffix, e.g.
			 *    [ 'paths', 'hello', 'world', 'get' ]
			 */
			key: string[];
			/**
			 * Whatever the loader output is, for this file.
			 */
			exports: unknown;
		},
	},
}
export interface OamergeTree {
	/**
	 * The tree of input files, with the list order from the configuration maintained.
	 */
	inputs: OamergeTreeInputs[];
}
export interface OamergeGeneratorParameters {
	cwd: string;
	output: string;
	TREE: OamergeTree;
}
export type OamergeGeneratorPlugin = (opts: OamergeGeneratorParameters) => Promise<void>;
