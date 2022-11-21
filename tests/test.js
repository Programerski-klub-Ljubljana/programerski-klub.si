import {test, chromium, expect} from '@playwright/test';
import https from "https"
import {returnArrays, writeResultsToFile} from "./utils.js";
import requestImageSize from 'request-image-size';
import axios from "axios";

let sitemap = null;
let imagesAndLinks = [];

test.describe('Test links and images', () => {

    test.beforeEach(async ({page}) => {
        // GET ALL ROUTES...
        await chromium.launch();
        await page.goto('/sitemap.xml');
        sitemap = await page.content();
        imagesAndLinks = await returnArrays(sitemap);
    });

    test("Test all links", async  () => {

        //TEST LINKS
        const test_results = [];

        const linksAxiosGet = imagesAndLinks.all_links.map(link => axios.head(link, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }), // unauthorized sites allowed ?
            decompress: false // if no data available because the head request don`t try to decompress it
        }));
        const promisesResolved = linksAxiosGet.map(promise => promise.catch(error => ({error})));

        await axios.all(promisesResolved).then(axios.spread((...responses) => {
            responses.map((response) => {

                if (response.status !== 200) {
                    test_results.push(response.error.code + ' at ' + response.error.config.url + '----------------test failed-----------------');
                    console.log(response.error.code + ' at ' + response.error.config.url);
                } else {
                    test_results.push('successful links status test at: ' + response.config.url);
                }
                expect.soft(response.status).toBe(200);
            })
            // WRITE TEST RESULTS TO .JSON FILE
            writeResultsToFile(test_results, 'linksTestRun');
        }))
    });

    test('Test all images', async () => {

        const test_results = [];
        const linksAxiosGet = imagesAndLinks.all_images.map(link => axios.head(link));
        const RIS = imagesAndLinks.all_images.map(link => requestImageSize(link));
        // catch all errors on promises
        const promisesResolved = linksAxiosGet.map(promise => promise.catch((error) => ({error})));
        const promisesResolved2 = RIS.map(promise => promise.catch((error) => ({error})));

        await axios.all(promisesResolved).then(axios.spread((...responses) => {
            responses.map((response) => {
                if (response.status !== 200) {
                    test_results.push(response.error.code + ' at ' + response.error.config.url + '--------------test failed--------------')
                    console.log(response.error.code + ' at ' + response.error.config.url);
                } else {
                    test_results.push('successful image status test at:' + response.config.url);
                }
                // WRITE TEST RESULTS TO .JSON FILE

                expect.soft(response.status).toBe(200);
            })
            writeResultsToFile(test_results, 'imageTestRun');
        }))

        promisesResolved2.map((promise, i) => promise.then((res) => {
            if (res.error) {
                console.log(res.error + ' image size error at: ' + imagesAndLinks.all_images[i]);
                expect.soft(res.height > 0 && res.width > 0).toBe(true);
            } else {
                expect.soft(res.height > 0 && res.width > 0).toBe(true);
            }
        }))
    })

})




