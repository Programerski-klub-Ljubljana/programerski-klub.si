import {expect, test, chromium} from '@playwright/test';
import {exec} from "child_process";

test('index page has expected h1', async ({page}) => {
    await chromium.launch();

    await page.goto('https://programerski-klub.si/');
    expect(await page.textContent('h1')).toBe('Programerski klub Ljubljana');
});

test('expect link to be active', async ({page}) => {
    await chromium.launch();


    exec("py sitemap.py", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(stdout);
        stdout.split('\n').forEach(link => {
            console.log(link)
            page.goto(link);

        })

    });
    // await page.locator('xpath=//ul/li/a[1]').click();
    // await page.goto('https://programerski-klub.si/vpis/trener');
    // expect(await page.textContent('h1')).toBe('Programerski klub Ljubljana');
});


