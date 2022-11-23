import axios from 'axios';
import fs from "fs";
// playwright.config.ts
import PlaywrightConfig from "../playwright.config.js";

let routesArray = [];
let all_images = [];
let all_links = [];
let all_emptystrings = [];
// ALL REGEX-es
export const routesRegex = /<loc>(.*?)</gm;
export const linksRegex = /href\s*=\s*"(.*?)"/gms;
export const imagesRegex = /\b(?:href|src)\s*=\s*"\s*([^"]*(?:\.png|\.jpg|\.bmp|\.jpeg|\.gif))\s*"/gm;
export const emptySRCHREFregex = /\b(?:href|src)\s*=\s*"\s*([^"]*)\s*"/gm;

export const port = PlaywrightConfig.webServer.port;

// GET ALL ROUTE LINKS AND IMAGES
export async function returnArrays(sitemap) {
    routesArray = findAllRoutes(sitemap);

    await axios.all(routesArray.map(routes => axios.get(routes))).then(axios.spread((...responses) => {

        // FIND ALL IMAGES
        all_images = findAllImages(responses);
        // FIND ALL THE LINKS
        all_links = findAllLinks(responses);
        //FIND ALL EMPTY SRC AND HREF STRINGS
        all_emptystrings = findEmptySRCandHREF(responses);


    }));
    return { all_links, all_images, all_emptystrings};
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



