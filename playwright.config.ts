import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	timeout:7000,
	use: {
		channel: 'chrome',
	},
	webServer: {
		reuseExistingServer:true,
		command: 'npm run build && npm run preview',
		port: 4173
	}
};

export default config;
