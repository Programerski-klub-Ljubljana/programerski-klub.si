import {test, chromium, expect} from '@playwright/test';
import {exec} from "child_process";
import https from "https"
import {
    checkIfUnique,
    findWithRegex,
    returnArrays,
    writeResultsToFile,
    port,
    replaceWithLocalhost,
    parse
} from "./utils.js";
import requestImageSize from 'request-image-size';
import axios from "axios";


let sitemap = [];
let imagesAndLinks = [];


test.describe('Test links and images', () => {

    test.beforeEach(async ({page}) => {
        // exec('npm run preview')
        await chromium.launch();

        await page.goto('/sitemap.xml');
        sitemap = await page.content();
        // GET ALL ROUTES...
        // axios.get('http://localhost:4173/sitemap.xml')
        //     .then(function (response) {
        //         // handle success
        //         sitemap = response;
        //     })
        //     .catch(function (error) {
        //         // handle error
        //         console.log(error);
        //     })
        imagesAndLinks = await returnArrays(sitemap);

    })


    test("Test all links", async () => {

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
    //exec('npx kill-port 4173');
});
test.describe('UNIT tests', () => {
    test("Test checkIfUnique function", async () => {
        const array = ['1', '2', '1'];
        const expectedArray = ['1', '2'];
        expect(checkIfUnique(array)).toEqual(expectedArray);
    })
    test("Find all client routes with regex ", async () => {
        const regex = /<loc>(.*?)</gm;
        const XMLContent = '<url><loc>https://programerski-klub.si//</loc></url> <url> <loc>https://programerski-klub.si//clani/danijelkorbar</loc></url>'
        const expectedRegexCatch = ['https://programerski-klub.si//', 'https://programerski-klub.si//clani/danijelkorbar'];
        expect(findWithRegex(XMLContent, false, regex)).toEqual(expectedRegexCatch);
    })

    test("Find all links in clinet routes with regex ", async () => {
        const regex = /href\s*=\s*"(.*?)"/gms;

        const XMLContent1 = {
            data: '<link href="../_app/immutable/assets/Vizitka-1d278f3e.css" rel="stylesheet">'

        }
        const XMLContent2 = {
            data: '<a href="https://github.com/danilojezernik" class="svelte-sj2pja">Git: danilojezernik</a>'
        }

        const XMLContent3 = {
            data: '<a href    = " / content# " class="svelte-sj2pja">Content</a>'

        }

        const responses = [XMLContent1, XMLContent2, XMLContent3];
        const expectedRegexCatch = ['../_app/immutable/assets/Vizitka-1d278f3e.css', 'https://github.com/danilojezernik', ' / content# '];
        expect(findWithRegex(responses, true, regex)).toEqual(expectedRegexCatch);

    })
    test("Find all images from client routes with regex ", async () => {
        const regex = /\b(?:href|src)\s*=\s*"\s*([^\s"].*(?:png|jpg|bmp))\s*"/gm;
        const XMLContent1 = {
            data: '<link href=" /favicon.png" rel="icon"/>'
        }
        const XMLContent2 = {
            data: '<link src="/danijelkorbar .png" rel="icon"/>'
        }
        const XMLContent3 = {
            data: '<link src = " / danijel korbar .bmp" rel="icon"/> '
        }
        const XMLContent4 = {
            data: '<link src="/danijelkorbar.png" rel="icon"/>'
        }
        const XMLContent5 = {
            data: '<link src="/danijelkorbar.jpg" rel="icon"/>'
        }
        const XMLContent6 = {
            data: '<link href = " / danijel korbar .jpg" rel="icon"/>'
        }

        const responses = [XMLContent1, XMLContent2, XMLContent3, XMLContent4, XMLContent5, XMLContent6];
        const expectedRegexCatch = [
            '/favicon.png',
            '/danijelkorbar .png',
            '/ danijel korbar .bmp',
            '/danijelkorbar.png',
            '/danijelkorbar.jpg',
            '/ danijel korbar .jpg'];
        expect(findWithRegex(responses, true, regex)).toEqual(expectedRegexCatch);
    })

    test("Parse all client routes", async () => {
        const PORT = port
        const routes = [
            'https://programerski-klub.si//clani/danilojezernik',
            'https://programerski-klub.si//clani/danijelkorbar'];
        const exptectedArray = [
            `http://localhost:${PORT}/clani/danilojezernik`,
            `http://localhost:${PORT}/clani/danijelkorbar`];
        expect(replaceWithLocalhost(routes)).toEqual(exptectedArray);
    })
    test("Parse all links from client routes page", async () => {
        const PORT = port
        const links = [
            './_app/immutable/assets/_page-e5f94684de.css',
            '../_app/immutable/assets/_page-e5f94684.css',
            'https://github.com/Programerski-klub-Ljubljana',
            '../../_app/immutable/assets/_page-090371f3.css',
            '/igre/racer#content'
        ];
        const exptectedArray = [
            `http://localhost:${PORT}/_app/immutable/assets/_page-e5f94684de.css`,
            `http://localhost:${PORT}/_app/immutable/assets/_page-e5f94684.css`,
            'https://github.com/Programerski-klub-Ljubljana',
            `http://localhost:${PORT}/_app/immutable/assets/_page-090371f3.css`,
            `http://localhost:${PORT}/igre/racer#content`
        ];
        expect(parse(links)).toEqual(exptectedArray);
    })

})



