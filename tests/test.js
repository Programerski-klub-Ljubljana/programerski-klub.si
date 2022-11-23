import {test, chromium, expect} from '@playwright/test';
import {exec} from "child_process";
import https from "https"
import {
    checkIfUnique,
    findWithRegex,
    returnArrays,
    writeResultsToFile,
    port,
    routesRegex,
    replaceWithLocalhost,
    parse, findEmptySRCandHREF, linksRegex, imagesRegex
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
    test("For empty src and href strings", async () => {
        const test_result = [];
        const responses = imagesAndLinks.all_emptystrings;
        if (responses.URL.lenght !== 0) {
            responses.URL.map(url => {
                console.log('found empty tag in: ' + responses.URL);
                test_result.push('found empty tag in: ' + url);
            })
            writeResultsToFile(test_result, 'findEmptyTags');
        };

        expect.soft(responses.i).toEqual(0);
        expect.soft(responses.URL.length).toEqual(0);
    });
});
test.describe('UNIT tests', () => {
    test("Test checkIfUnique function", async () => {
        const array = ['1', '2', '1'];
        const expectedArray = ['1', '2'];
        expect(checkIfUnique(array)).toEqual(expectedArray);
    })
    test("Find all client routes with regex ", async () => {

        const XMLContent = '<url><loc>https://programerski-klub.si//</loc></url> <url> <loc>https://programerski-klub.si//clani/danijelkorbar</loc></url>'
        const expectedRegexCatch = ['https://programerski-klub.si//', 'https://programerski-klub.si//clani/danijelkorbar'];
        expect(findWithRegex(XMLContent, false, routesRegex)).toEqual(expectedRegexCatch);
    })

    test("Find all links in clinet routes with regex ", async () => {
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
        expect(findWithRegex(responses, true, linksRegex)).toEqual(expectedRegexCatch);

    })
    test("Find all images from client routes with regex ", async () => {

        const XMLContent1 = {
            data: '<link href =     "/content#" rel="icon" src="/danijelKorbar.png">'
        }
        const XMLContent2 = {
            data: '<link src="/danijelkorbar.png" rel="icon"/>'
        }
        const XMLContent3 = {
            data: '<link src = " / danijel korbar.bmp" rel="icon"/> '
        }
        const XMLContent4 = {
            data: '<link src="/danijelkorbar.jpeg " rel="icon"/>'
        }
        const XMLContent5 = {
            data: '<link src="/danijelkorbar.gif" rel="icon"/>'
        }
        const XMLContent6 = {
            data: '<link href = " / danijel korbar .jpg" rel="icon"/>'
        }
        // must NOT capture
        const XMLContent7 = {
            data: '<link href = " /pngjpgjpegbmpgif/content#  " rel="icon"/>'
        }

        const responses = [XMLContent1, XMLContent2, XMLContent3, XMLContent4, XMLContent5, XMLContent6, XMLContent7];
        const expectedRegexCatch = [
            '/danijelKorbar.png',
            '/danijelkorbar.png',
            '/ danijel korbar.bmp',
            '/danijelkorbar.jpeg',
            '/danijelkorbar.gif',
            '/ danijel korbar .jpg'];
        expect(findWithRegex(responses, true, imagesRegex)).toEqual(expectedRegexCatch);
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
            '/igre/racer#content',
            './_app/immutable/assets/_page-e5f94684de.css',
            '../_app/immutable/assets/_page-e5f94684.css',
            '../../_app/immutable/assets/_page-090371f3.css',
            'https://github.com/Programerski-klub-Ljubljana'

        ];
        const exptectedArray = [
            `http://localhost:${PORT}/igre/racer#content`,
            `http://localhost:${PORT}/_app/immutable/assets/_page-e5f94684de.css`,
            `http://localhost:${PORT}/_app/immutable/assets/_page-e5f94684.css`,
            `http://localhost:${PORT}/_app/immutable/assets/_page-090371f3.css`,
            'https://github.com/Programerski-klub-Ljubljana'
        ];
        expect(parse(links)).toEqual(exptectedArray);
    })
    test("For empty src and href strings", async () => {

        const XMLContent1 = {
            data: '<link href =     "" rel="icon" src="       ">',
            config:{
                url: 'content1'
            }
        }
        const XMLContent2 = {
            data: '<link src="" rel="icon"/>',
            config:{
                url: 'content2'
            }
        }
        const XMLContent3 = {
            data: '<link src = " " rel="icon"/> ',
            config:{
                url: 'content3'
            }
        }
        const responses = [XMLContent1, XMLContent2, XMLContent3]

        const find = findEmptySRCandHREF(responses);
        expect.soft(find.i).toEqual(4);
        expect.soft(find.URL.length).toEqual(4);
    })

})