/** @type {import('next').NextConfig} */

import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants.js';



// @ts-check
 
export default (phase, { defaultConfig }) => {
	/**
	 * @type {import('next').NextConfig}
	 */
	if (phase === PHASE_PRODUCTION_BUILD) {
		const nextConfig = {
			//basePath: "/GNN-Visualiser",
			output: "export"
		};
		return nextConfig
	}
	else{
		const nextConfig = {
			//basePath: "/GNN-Visualiser",
			output: "export"
		};
		return nextConfig
	}
}