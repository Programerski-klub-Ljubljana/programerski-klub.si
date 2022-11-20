import axios from 'axios';
import fs from "fs";

let routesArray = [];
let all_images = [];
let all_links = [];
const port = '4173';

// GET ALL ROUTE LINKS AND IMAGES
export async function returnArrays(sitemap) {
    routesArray = findAllRoutes(sitemap);
    return await axios.all(routesArray.map(routes => axios.get(routes))).then(axios.spread((...responses) => {

        //FIND ALL IMAGES
        all_images = findAllImages(responses);
        // FIND ALL THE LINKS
        all_links = findAllLinks(responses);

        return {all_links, all_images};
    }));
}

export const findAllRoutes = (sitemap) => {

    //FIND ALL ROUTES
    let result;
    const a_match = /<loc>(.*)</gm;
    result = a_match.exec(sitemap);
    while (result) {
        result = a_match.exec(sitemap);
        if (result) {
            routesArray.push(result[1])
        }
    }
    // GET ALL CLIENT ROUTES...
    routesArray.map((route, i) => {
        routesArray[i] = route.replace('https://programerski-klub.si//', `http://localhost:${port}/`)
    });

    return routesArray
}

export function findAllImages(responses) {
    let all_images = [];
    responses.map(responses => {
            //FIND ALL IMAGES
            const a_match = /\b(?:href|src)="([^\s"]*\.(?:png|jpg|bmp))"/gm;
            let result;
            result = a_match.exec(responses.data);
            while (result) {
                result = a_match.exec(responses.data);
                if (result) {
                    if (!all_images.includes(result[1])) {
                        all_images.push(result[1]);
                    }

                }
            }

        }
    )
    //PARSE ALL IMAGES
    all_images.map((link, i) => {
        if (link.charAt(0) === '/') {
            all_images.splice(i, 1, `http://localhost:${port}${link}`)
        }
    })
    return all_images
}

export function findAllLinks(responses) {
    let all_links = [];
    responses.map(response => {
        //FIND ALL LINKS
        const a_match = /href\s*=\s*"(.*?)"/gms;
        let result;

        result = a_match.exec(response.data);
        while (result) {
            result = a_match.exec(response.data);
            if (result) {
                if (!all_links.includes(result[1])) {
                    all_links.push(result[1]);
                }

            }
        }
    })
    all_links.map((link, i) => {
        link = link.replace('..', '');
        if (link.charAt(0) === '.') {
            link = link.replace('.', '');
        }
        if (link.charAt(0) === '/') {
            all_links.splice(i, 1, `http://localhost:${port}${link}`)

        }
        if (link.includes('tel')) {
            all_links.splice(i, 1)
        }
    });
    return all_links
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


