import axios from 'axios';
import fs from "fs";

let routesArray = [];
let all_images = [];
let array = [];
export const port = '4173';

// GET ALL ROUTE LINKS AND IMAGES
export async function returnArrays(sitemap) {
    routesArray = findAllRoutes(sitemap);

    await axios.all(routesArray.map(routes => axios.get(routes))).then(axios.spread((...responses) => {
        console.log(responses[2])
        // FIND ALL IMAGES
        all_images = findAllImages(responses);
        // FIND ALL THE LINKS
        array = findAllLinks(responses);

    }));
    return {all_links: array, all_images};
}

export const findAllRoutes = (sitemap) => {
    //FIND ALL ROUTES

    const regex = /<loc>(.*)</gm;
    const routes = findWithRegex(sitemap, false, regex);

    return replaceWithLocalhost(routes)
}
export function replaceWithLocalhost(routes){
    const replacedArray = [];
    routes.map(route => {
        route = route.replace('https://programerski-klub.si//', `http://localhost:${port}/`)
        replacedArray.push(route);
    });

    return replacedArray;
}

export function findAllImages(responses) {

    const regex = /\b(?:href|src)="([^\s"]*\.(?:png|jpg|bmp))"/gm;
    const neki = findWithRegex(responses, true, regex);
    return parse(neki);
}

export function findAllLinks(responses) {

    const regex = /href\s*=\s*"(.*?)"/gms;
    // FIND ALL LINKS
    let all_links = findWithRegex(responses, true, regex);

    return parse(all_links);
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
    links.map((link, i) => {
        link = link.replace('..', '');
        if (link.charAt(0) === '.') {
            link = link.replace('.', '');
        }
        if (link.includes('tel')) {
            links.splice(i, 1)
        }
        if (link.charAt(0) === '/') {

            links.splice(i, 1, `http://localhost:${port}${link}`)
        }
    })
    ;
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

export function checkIfUnique(array){
    const uniqueArray = array.filter((c, index) => {
        return array.indexOf(c) === index;
    });

    return uniqueArray;
}



