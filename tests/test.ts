import {test, chromium, expect} from '@playwright/test';
import axios from 'axios';
import https from "https";
import fs from "fs";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import requestImageSize from 'request-image-size';

// TODO: REMOVE CORRUPT.PNG IN CLANI/DANIJELKORBAR SITE AND CORRECT TWO BAD URL REQUEST SITES(FOR TESTS)
// TODO: ADD HELPER FUNCTIONS FOR TESTS IN UTILS.TS

const routesArray: string[] = [];
const all_links: string[] = [];
const parse_links: string[] = [];
const replaceArray: string[] = [];
const all_images: string[] = [];
const parse_images_links: string[] = [];
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
            if (link.charAt(0) == '/') link = `http://localhost:${port}${link}`;

            if (!link.includes('tel')) {
                parse_links.push(link);
            }
        });
        // GET ALL IMAGES
        await axios.all(replaceArray.map(routes => axios.get(routes))).then(axios.spread((...responses) => {
            for (const response of responses) {

                const a_match = /\b(?:href|src)="([^\s"]*\.(?:png|jpg|bmp))"/gm;
                let result: RegExpExecArray | null;

                result = a_match.exec(response.data);
                while (result) {
                    result = a_match.exec(response.data);
                    if (result) {

                        if (!all_images.includes(result[1])) {
                            console.log('push' + result[1])

                            all_images.push(result[1]);
                        }

                    }
                }
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
                    test_results.push(response.error.code + ' at ' + response.error.config.url + '-------------test failed-----------');

                } else {
                    test_results.push('test successful at: ' + response.config.url)

                }
                expect.soft(response.status).toBe(200);
            })
            // WRITE TEST RESULTS TO .JSON FILE

            fs.writeFile(
                `tests/linkTests.json`,

                JSON.stringify(test_results, null, 1),

                function (err) {
                    if (err) {
                        console.error('Error writing file');
                    }
                }
            );
        }))
    });

    test('Test all images', async () => {

        const linksAxiosGet = parse_images_links.map(link => axios.head(link));
        const RIS = parse_images_links.map(link => requestImageSize(link));
        // catch all errors on promises
        const promisesResolved = linksAxiosGet.map(promise => promise.catch((error: any) => ({error})));
        const promisesResolved2 = RIS.map(promise => promise.catch((error: any) => ({error})));
        let i = 0;

        await axios.all(promisesResolved).then(axios.spread((...responses) => {
            responses.map((response) => {
                if (response.status !== 200) {
                    console.log(response.error.code + ' at ' + response.error.config.url);
                } else {
                    console.log(response.config.url)
                }
                expect.soft(response.status).toBe(200);
            })
        }))

        promisesResolved2.map(promise => promise.then((res: any) => {
            if (res.error) {
                console.log(res.error + ' error at: ' + parse_images_links[i]);
                expect.soft(res.height > 0 && res.width > 0).toBe(true);
            } else {
                expect.soft(res.height > 0 && res.width > 0).toBe(true);
            }
            i++;
        }))
    })

})




