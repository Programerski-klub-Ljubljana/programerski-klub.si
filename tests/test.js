import {test, chromium, expect} from '@playwright/test';
import {exec} from "child_process";

import {
    checkIfUnique,
    findWithRegex,
    returnArrays,
    port,
    routesRegex,
    replaceWithLocalhost,
    parse, findEmptySRCandHREF, linksRegex, imagesRegex, getAllLinkResponses, getAllImageResponses, checkForURLlength
} from "./utils.js";

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
        const responses = await getAllLinkResponses(imagesAndLinks.all_links);
        responses.map(response => {
            expect.soft(response.status).toBe(200);
        })
    });

    test('Test all images', async () => {
        const responses = await getAllImageResponses(imagesAndLinks.all_images);
        // TEST ALL IMAGE STATUSES
        responses.promise1.map(res => {
            expect.soft(res.status).toBe(200);
        })
        //TEST ALL IMAGE SIZES
        responses.promisesResolved2.map((promise, i) => promise.then((images => {
            if (images.error) {
                console.log(images.error + ' image size error at: ' + imagesAndLinks.all_images[i]);
                expect.soft(images.height > 0 && images.width > 0).toBe(true);
            } else {
                expect.soft(images.height > 0 && images.width > 0).toBe(true);
            }
        })));

    })
    //exec('npx kill-port 4173');
    test("For empty src and href strings", async () => {

        const responses = imagesAndLinks.all_emptystrings;
        // CHECK IF RESPONSE URLS ARRAY IS NOT EMPTY AND WRITE TEST RESULTS FO FILE
        checkForURLlength(responses)

        expect.soft(responses.i).toEqual(0);
        expect.soft(responses.URL.length).toEqual(0);
    });
});
test.describe('UNIT tests', () => {
    test("if array items are not duplicates", async () => {
        const array = ['/content#', '/src/image.jpg', '/content#'];
        const expectedArray = ['/content#', '/src/image.jpg'];
        expect(checkIfUnique(array)).toEqual(expectedArray);
    })
    test("all client routes with regex ", async () => {

        const XMLContent = '<url><loc>https://programerski-klub.si//</loc></url> <url> <loc>https://programerski-klub.si//clani/danijelkorbar</loc></url>'
        const expectedRegexCatch = ['https://programerski-klub.si//', 'https://programerski-klub.si//clani/danijelkorbar'];
        expect(findWithRegex(XMLContent, false, routesRegex)).toEqual(expectedRegexCatch);
    })

    test("all links in clinet routes with regex ", async () => {
        const XMLContent1 = {
            data: '<link href="../_app/immutable/assets/Vizitka-1d278f3e.css" rel="stylesheet">'+
                '<a href="https://github.com/danilojezernik" class="svelte-sj2pja">Git: danilojezernik</a>'+
                '<a href    = " / content# " class="svelte-sj2pja">Content</a>'
        }

        const responses = [XMLContent1];
        const expectedRegexCatch = ['../_app/immutable/assets/Vizitka-1d278f3e.css', 'https://github.com/danilojezernik', ' / content# '];
        expect(findWithRegex(responses, true, linksRegex)).toEqual(expectedRegexCatch);

    })
    test("all images from client routes with regex ", async () => {

        const XMLContent1 = {
            data:
                '<link href =  "/content#" rel="icon" src="/danijelKorbar.png">' +
                '<link src="/danijelkorbar.png" rel="icon"/> ' +
                '<link src = " / danijel korbar.bmp" rel="icon"/> ' +
                '<link src="/danijelkorbar.jpeg " rel="icon"/> ' +
                '<link src="/danijelkorbar.gif" rel="icon"/>' +
                '<link href = " / danijel korbar .jpg" rel="icon"/>' +
                '<link href = " / danijel korbar .jpg" rel="icon"/>'
        }
        // must NOT capture
        const XMLContent2 = {
            data: '<link href = " /pngjpgjpegbmpgif/content#  " rel="icon"/>'
        }
        const responses = [XMLContent1, XMLContent2];
        const expectedRegexCatch = [
            '/danijelKorbar.png',
            '/danijelkorbar.png',
            '/ danijel korbar.bmp',
            '/danijelkorbar.jpeg',
            '/danijelkorbar.gif',
            '/ danijel korbar .jpg'];
        expect(findWithRegex(responses, true, imagesRegex)).toEqual(expectedRegexCatch);
    })

    test("parsing of all client routes", async () => {
        const PORT = port
        const routes = [
            'https://programerski-klub.si//clani/danilojezernik',
            'https://programerski-klub.si//clani/danijelkorbar'];
        const exptectedArray = [
            `http://localhost:${PORT}/clani/danilojezernik`,
            `http://localhost:${PORT}/clani/danijelkorbar`];
        expect(replaceWithLocalhost(routes)).toEqual(exptectedArray);
    })
    test("parsing of all links from client routes page", async () => {
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
    test("for empty src and href strings", async () => {

        const XMLContent1 = {
            data: '<link href =     "" rel="icon" src="       ">',
            config: {
                url: 'content1'
            }
        }
        const XMLContent2 = {
            data: '<link src="" rel="icon"/>',
            config: {
                url: 'content2'
            }
        }
        const XMLContent3 = {
            data: '<link src = " " rel="icon"/> ',
            config: {
                url: 'content3'
            }
        }
        const responses = [XMLContent1, XMLContent2, XMLContent3]
        const find = findEmptySRCandHREF(responses);
        expect.soft(find.i).toEqual(4);
        expect.soft(find.URL.length).toEqual(4);
    })

})