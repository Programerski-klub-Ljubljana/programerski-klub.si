import {test, chromium, expect} from '@playwright/test';
import {exec} from "child_process";

const linkArray: string[] = [];

exec("py sitemap.py", (error, stdout, stderr) => {

    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    stdout.split('\n').forEach((link,i) => {
        const links = `http://localhost:5173/${link}`;
                linkArray[i] = links.replace(/[\n\r]/g, '');
    });
});
test('check links', async ({page}) => {
    await chromium.launch();
    for (let i = 0; i < linkArray.length; i++) {
        console.log('fe')
        await page.goto(`${linkArray[i]}`);
        console.log(`in ------------- ${linkArray[i]} `)
        const hrefs = await page.$$eval('a', as => as.map(a => a.href));
        for (let i = 1; i < hrefs.length; i++) {
            console.log(`found links ----- ${hrefs[i]}`);
            if(!hrefs[i].includes('tel:')){

                page.goto(`${hrefs[i]}`).then(() => {
                    console.log()
                }).catch(() => {
                    console.log('err')
                })
                // await page.waitForTimeout(5000); // wait for 5 seconds
                const pageTitle = await page.title();
                const pageURL = page.url();
                console.log(pageURL, 'URL----');
                console.log(pageTitle, 'TITLE----');
            }
            else{
                console.log('link has no tel!')
            }
        }
    }
});
test('check images', async ({page}) => {
    const browser = await chromium.launch();
    for (let i = 0; i < linkArray.length; i++) {
        await page.goto(`${linkArray[i]}`);
        console.log(`in ------------- ${linkArray[i]} `)
        const images = await page.$$eval('img', as => as.map(a => a));
        if (images.length === 0) {
            console.log('no images on this page')
            await browser.close();
        } else {
            for (let j = 0; j < images.length; j++) {
                console.log(images, 'images');
                console.log(`xpath=/html/body//img[contains(@alt,${images.toString()})]`);
                // await expect(page.locator(`${images[i]}`)).toBeVisible();
            }
        }
    }
});




