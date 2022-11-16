import {test, chromium, expect} from '@playwright/test';
import axios from 'axios';
import https from "https";
import fs from "fs";

const routesArray: string[] = [];
const all_links: string[] = [];
const parse_links: string[] = [];
const replaceArray: string[] = [];
const all_images: string[] = [];
const parse_images_links: string[] = [];
const all_images_tags: string[] = [];
const port = '4173';
test.describe('Test links and images', () => {
    test.beforeEach(async ({page}) => {
        // GET ALL ROUTES...
        await chromium.launch();
        await page.goto('/sitemap.xml');
        const sitemap = await page.content();

        let result: RegExpExecArray | null;
        const a_match = /<loc>(.*)</gm;
        result = a_match.exec(sitemap);
        while (result) {
            result = a_match.exec(sitemap);
            if (result) {
                routesArray.push(result[1])
            }
        }
        // GET ALL CLIENT ROUTES...
        for (const route of routesArray) {
            const replace = route.replace('https://programerski-klub.si//', `http://localhost:${port}/`);
            replaceArray.push(replace);
        }
        // GET ALL ROUTE LINKS...
        await axios.all(replaceArray.map(routes => axios.get(routes))).then(axios.spread((...responses) => {
            for (const response of responses) {
                // FIND ALL THE LINKS

                const a_match = /href\s*=\s*"(.*?)"/gms;
                let result: RegExpExecArray | null;
                result = a_match.exec(response.data);
                while (result) {
                    result = a_match.exec(response.data);

                    if (result) {

                        if (!all_links.includes(result[1])) {
                            all_links.push(result[1])
                        }

                    }
                }
            }
            return all_links;

        }));
        // PARSE ALL LINKS...
        all_links.map(link => {

            // replace pathed hrefs
            link = link.replace('..', '');
            if (link.charAt(0) === '.') {
                link = link.replace('.', '');
            }
            //add absolute path
            if (link.includes('_app')) {
                link = `http://localhost:${port}/build${link}`;
            }
            if (link.charAt(0) == '/') link = `http://localhost:${port}${link}`;

            if (!link.includes('tel') && !link.includes('app')) {
                parse_links.push(link);
            }
        })
        await chromium.launch();
        // GET ALL IMAGES
        await axios.all(replaceArray.map(routes => axios.get(routes))).then(axios.spread((...responses) => {
            for (const response of responses) {

                const a_match = /\b(?:href|src)="([^\s"]*\.(?:png|jpg|bmp))"/gm;
                const tag_match = /<img.*?>/gm;
                let result: RegExpExecArray | null;

                result = a_match.exec(response.data);
                while (result) {
                    result = a_match.exec(response.data);
                    if (result) {

                        if (!all_images.includes(result[1])) {
                            console.log('push' + result[1] )

                            all_images.push(result[1]);
                        }

                    }
                }
                // let result2: RegExpExecArray | null;
                // result2 = tag_match.exec(response.data);
                // while (result2) {
                //     result2 = tag_match.exec(response.data);
                //     if (result2) {
                //         console.log('found img tag: ' + result2 + " " + response.config.url)
                //         if (!all_images_tags.includes(result2[1])) {
                //
                //             all_images_tags.push(result2[1]);
                //         }
                //
                //     }
                // }

            }

            all_images.map(link => {

                if (link.charAt(0) == '/') link = `http://localhost:${port}${link}`;
                parse_images_links.push(link);
            })

            return parse_images_links;

        })).catch(err => {
            console.log(err)
        });
    });


    test("Test all links", async () => {
        const test_results: string[] = [];

        const linksAxiosGet = parse_links.map(link => axios.head(link, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }), // unauthorized sites allowed ?
            decompress: false // if no data available because the head request don`t try to decompress it
        }));
        const promisesResolved = linksAxiosGet.map(promise => promise.catch(error => ({error})));

        await axios.all(promisesResolved).then(axios.spread((...responses) => {
            responses.map((response) => {

                if (response.status !== 200) {
                    test_results.push(response.error.code + ' at ' + response.error.config.url + '-------------test failed-----------')

                } else {
                    test_results.push('test successful at: ' + response.config.url)
                }
                expect.soft(response.status).toBe(200);
            })
                // WRITE TEST RESULTS TO .JSON FILE

                fs.writeFile(

                    `tests/testResults/linkTests.json`,

                    JSON.stringify(test_results, null, 1),

                    function (err) {
                        if (err) {
                            console.error('Error writing file');
                        }
                    }
                );
        }))
    });

    test('check images', async () => {

        const linksAxiosGet = parse_images_links.map(link => axios.head(link));
        const promisesResolved = linksAxiosGet.map(promise => promise.catch(error => ({error})));

        await axios.all(promisesResolved).then(axios.spread((...responses) => {
            responses.map((response) => {
                if (response.status !== 200) {
                    console.log(response.error.code + ' at ' + response.error.config.url);
                } else if (!response.headers['content-type'].includes('image')) {
                    console.log('the file is not of an image type content but has: ' + response.headers['content-type']);
                } else {
                    console.log(response.config.url)
                }
                expect.soft(response.status).toBe(200);
                expect.soft(response.headers['content-type'].includes('image')).toBe(true);
            })
        }))
    });

})




