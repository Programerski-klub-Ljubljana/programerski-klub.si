import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	use: {
		channel: 'chrome',
	},
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	}
};

export default config;
