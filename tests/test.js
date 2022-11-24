import {test, chromium, expect} from '@playwright/test';
import {
    checkIfUnique,
    findWithRegex,
    returnArrays,
    port,
    routesRegex,
    replaceWithLocalhost,
    parse, findEmptySRCandHREF, linksRegex, imagesRegex, getAllLinkResponses, getAllImageResponses, checkForURLlength
} from "./utils.js";

let imagesAndLinks = [];

test.describe('Test links and images', () => {

    test.beforeEach(async () => {
        await chromium.launch();
        // GET ALL THE LINKS AND IMAGES FROM SITEMAP URLs
        imagesAndLinks = await returnArrays();
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
        // TEST ALL IMAGE RESPONSE STATUSES
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
    test("For empty src and href strings", async () => {

        const responses = imagesAndLinks.all_emptystrings;
        // CHECK IF RESPONSE URLS ARRAY IS NOT EMPTY AND WRITE TEST RESULTS FO FILE
        checkForURLlength(responses)

        // BOTH MUST EQUAL TO 0 IF NO EMPTY TAGS WERE FOUND
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

    test("all links in client routes with regex ", async () => {
        const XMLContent1 = {
            data:
                '<link href="../_app/immutable/assets/Vizitka-1d278f3e.css" rel="stylesheet">' +
                '<a href="https://github.com/danilojezernik" class="svelte-sj2pja">Git: danilojezernik</a>' +
                '<a href    = " / content# " class="svelte-sj2pja">Content</a>'
        }

        const responses = [XMLContent1];
        const expectedRegexCatch = ['../_app/immutable/assets/Vizitka-1d278f3e.css', 'https://github.com/danilojezernik', ' / content# '];
        expect(findWithRegex(responses, true, linksRegex)).toEqual(expectedRegexCatch);

    })
    test("all images from client routes with regex ", async () => {

        const XMLContent1 = {
            data:
                '<img rel="icon" src="/danijelKorbar.png" alt="">' +
                '<a href="/admin/picture.png">PKL</a>' +
                '<img src="/danijelkorbar.png" rel="icon" alt=""/> ' +
                '<img src = " / danijel korbar.bmp" rel="icon" alt=""/> ' +
                '<img src="/danijelkorbar.jpeg " rel="icon" alt=""/> ' +
                '<img src="/danijelkorbar.gif" rel="icon" alt=""/>' +
                '<img src = " / danijel korbar .jpg" rel="icon" alt=""/>'
        }
        // MUST NOT CAPTURE
        const XMLContent2 = {
            data: '<link href = " /pngjpgjpegbmpgif/content#  " rel="icon"/>'
        }
        const responses = [XMLContent1, XMLContent2];
        const expectedRegexCatch = [
            '/danijelKorbar.png',
            '/admin/picture.png',
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
        const expectedArray = [
            `http://localhost:${PORT}/clani/danilojezernik`,
            `http://localhost:${PORT}/clani/danijelkorbar`];
        expect(replaceWithLocalhost(routes)).toEqual(expectedArray);
    })
    test("parsing of all links from client routes page", async () => {
        const PORT = port
        const links = [
            '/games/racer#content',
            './_app/immutable/assets/_page-e5f94684de.css',
            '../_app/immutable/assets/_page-e5f94684.css',
            '../../_app/immutable/assets/_page-090371f3.css',
            'https://github.com/Programerski-klub-Ljubljana'

        ];
        const expectedArray = [
            `http://localhost:${PORT}/games/racer#content`,
            `http://localhost:${PORT}/_app/immutable/assets/_page-e5f94684de.css`,
            `http://localhost:${PORT}/_app/immutable/assets/_page-e5f94684.css`,
            `http://localhost:${PORT}/_app/immutable/assets/_page-090371f3.css`,
            'https://github.com/Programerski-klub-Ljubljana'
        ];
        expect(parse(links)).toEqual(expectedArray);
    })
    test("for empty src and href strings", async () => {

        const XMLContent1 = {
            data:
                '<img  rel="icon" src="       " alt="">' +
                '<a href =     "">PKL</a>',
            config: {
                url: 'content1'
            }
        }
        const XMLContent2 = {
            data: '<img src="" rel="icon" alt=""/>',
            config: {
                url: 'content2'
            }
        }
        const XMLContent3 = {
            data: '<img src = " " rel="icon" alt=""/> ',
            config: {


                url: 'content3'
            }
        }
        const responses = [XMLContent1, XMLContent2, XMLContent3]
        const find = findEmptySRCandHREF(responses)
        expect.soft(find.i).toEqual(4);
        expect.soft(find.URL.length).toEqual(4);
    })

})