import PlaywrightConfig from "../playwright.config.js";
import requestImageSize from "request-image-size";
import axios from "axios";
import https from "https";
import fs from "fs";

let all_emptystrings = [];
let routesArray = [];
let all_images = [];
let all_links = [];

// ALL REGEX-es
export const imagesRegex = /\b(?:href|src)\s*=\s*"\s*([^"]*(?:\.png|\.jpg|\.bmp|\.jpeg|\.gif))\s*"/gm;
export const emptySRCHREFregex = /\b(?:href|src)\s*=\s*"\s*([^"]*)\s*"/gm;
export const linksRegex = /href\s*=\s*"(.*?)"/gms;
export const routesRegex = /<loc>(.*?)</gm;

// IMPORT PORT FROM PLAYWRIGHT.CONFIG
export const port = PlaywrightConfig.webServer.port;

// GET ALL ROUTE LINKS AND IMAGES
export async function returnArrays() {
    // GET ALL SITEMAP URLs
    routesArray = findAllRoutes(await getSitemapURLS());

    await axios.all(routesArray.map(routes => axios.get(routes))).then(axios.spread((...responses) => {

        // FIND ALL IMAGES WITH REGEX
        all_images = findAllImages(responses);
        // FIND ALL THE LINKS WITH REGEX
        all_links = findAllLinks(responses);
        //FIND ALL EMPTY SRC AND HREF STRINGS WITH REGEX
        all_emptystrings = findEmptySRCandHREF(responses);

    }));
    return {all_links, all_images, all_emptystrings};
}
export async function getSitemapURLS(){
    let sitemap = [];
    await axios.get(`http://localhost:${port}/sitemap.xml`)
        .then(response => {
            sitemap = response.data;
        })
        .catch(err => {
            console.log(err);
        })
    return sitemap;
}

export async function getAllLinkResponses(all_links) {
    const test_results = [];

    const linksAxiosGet = all_links.map(link => axios.head(link, {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        }),
        decompress: false // if no data available because the head request don`t try to decompress it
    }));

    const promisesResolved = linksAxiosGet.map(promise => promise.catch(error => ({error})));
    return await axios.all(promisesResolved).then(axios.spread((...responses) => {
        responses.map((response) => {
            // IF THERE IS AN EMPTY HREF
            if (response.status !== 200 && response.error.code === 'ERR_INVALID_URL') {
                test_results.push(response.error.code + '/ FOUND AN EMPTY TAG ' + '----------------test failed-----------------');
                console.log('found an empty tag')
            } else {
                // IF THERE IS AN 404 ERROR, BAD REQUEST
                if (response.status !== 200) {
                    test_results.push(response.error.code + ' at ' + response.error.config.url + '----------------test failed-----------------');
                    console.log(response.error.code + ' at ' + response.error.config.url);
                } else {
                    test_results.push('successful links status test at: ' + response.config.url);
                }
            }

        })
        // WRITE TEST RESULTS TO .JSON FILE
        writeResultsToFile(test_results, 'linksTestRun');
        return responses;

    }))
}

export async function getAllImageResponses(all_images) {
    const test_results = [];
    const promise1 = [];
    const linksAxiosGet = all_images.map(link => axios.head(link));
    const RIS = all_images.map(link => requestImageSize(link));
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
            promise1.push(response);
        })
        // WRITE TEST RESULTS TO .JSON FILE
        writeResultsToFile(test_results, 'imageTestRun');
    }))

    return {promise1, promisesResolved2}

}

export function checkForURLlength(responses) {
    const test_result = [];
    // IF URL LENGTH > 0 , FOUND AN EMPTY HREF OR SRC
    if (responses.URL.length !== 0) {
        responses.URL.map(url => {
            console.log('found empty tag in: ' + responses.URL);
            test_result.push('found empty tag in: ' + url);
        })
        writeResultsToFile(test_result, 'findEmptyTags');
    }
}

export const findAllRoutes = (sitemap) => {
    //FIND ALL ROUTES
    const routes = findWithRegex(sitemap, false, routesRegex);

    return replaceWithLocalhost(routes)
}

export function replaceWithLocalhost(routes) {
    const replacedArray = [];
    routes.map(route => {
        route = route.replace('https://programerski-klub.si//', `http://localhost:${port}/`)
        replacedArray.push(route);
    });

    return replacedArray;
}

export function findAllImages(responses) {

    const find = findWithRegex(responses, true, imagesRegex)
    return parse(find);
}

export function findAllLinks(responses) {

    // FIND ALL LINKS
    let all_links = findWithRegex(responses, true, linksRegex);

    return parse(all_links);
}

export function findEmptySRCandHREF(responses) {
    //FIND ALL EMPTY SRC AND HREF STRINGS
    const URL = [];
    let i = 0;

    responses.map(response => {
        // SEARCH WITH REGEX
        let result;
        result = emptySRCHREFregex.exec(response.data);
        while (result) {
            const trim = result[1].trim();
            if (trim.length === 0) {
                URL.push(response.config.url);
                i++;
            }
            result = emptySRCHREFregex.exec(response.data);
        }

    })
    return {i, URL};
}

export function writeResultsToFile(test_results, name) {
    fs.writeFile(
        `tests/${name}.json`,

        JSON.stringify(test_results, null, 1),

        function (err) {
            if (err) {
                console.error('Error writing file');
            }
        }
    );
}

export function parse(links) {
    const regex = /[../]+/;
    links.map((link, i) => {
        link = link.replace(regex, '/');
        if (link.charAt(0) === '.') {
            link = link.replace('.', '');
        }
        if (link.includes('tel')) {
            links.splice(i, 1)
        }
        if (link.charAt(0) === '/') {

            links.splice(i, 1, `http://localhost:${port}${link}`)
        }
    });
    return checkIfUnique(links);
}

export function findWithRegex(responses, map, regex) {
    let array = [];
    if (map) {
        responses.map(response => {
            // SEARCH WITH REGEX
            let result;
            result = regex.exec(response.data);

            while (result) {
                if (!array.includes(result[1])) {
                    array.push(result[1]);
                }
                result = regex.exec(response.data);

                if (result) {
                    if (!array.includes(result[1])) {
                        array.push(result[1]);
                    }

                }
            }
        })
    } else {
        // SEARCH WITH REGEX
        let result;
        result = regex.exec(responses);
        while (result) {
            if (!array.includes(result[1])) {
                array.push(result[1]);
            }
            result = regex.exec(responses);
            if (result) {
                if (!array.includes(result[1])) {
                    array.push(result[1]);
                }

            }
        }
    }

    return array;
}

export function checkIfUnique(array) {
    const uniqueArray = array.filter((c, index) => {
        return array.indexOf(c) === index;
    });

    return uniqueArray;
}



