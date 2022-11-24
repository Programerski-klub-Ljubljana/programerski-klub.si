import requestImageSize from 'request-image-size';
import axios from 'axios';
import https from 'https';
import fs from 'fs';

let emptyStrings = [];
let sitemapRoutes = [];
let images = [];
let links = [];

// ALL REGEX-es
export const imagesRegex = /\b(?:href|src)\s*=\s*"\s*([^"]*(?:\.png|\.jpg|\.bmp|\.jpeg|\.gif))\s*"/gm;
export const emptySRCHREFregex = /\b(?:href|src)\s*=\s*"\s*([^"]*)\s*"/gm;
export const linksRegex = /href\s*=\s*"(.*?)"/gms;
export const routesRegex = /<loc>(.*?)</gm;

// IMPORT PORT FROM PLAYWRIGHT.CONFIG
export const port = '5173';
export const localHost = `http://localhost:${port}`;

// TODO: Ne potrebujes
export function checkIfUnique(array) {
  const uniqueArray = array.filter((c, index) => array.indexOf(c) === index);

  return uniqueArray;
}

// TODO: localhost: v config.
export function parse(parseLinks) {
  const regex = /[../]+/;
  parseLinks.map((link, i) => {
    // eslint-disable-next-line no-param-reassign
    link = link.replace(regex, '/');
    if (link.charAt(0) === '.') {
      // eslint-disable-next-line no-param-reassign
      link = link.replace('.', '');
    }
    if (link.includes('tel')) {
      parseLinks.splice(i, 1);
    }
    if (link.charAt(0) === '/') {
      parseLinks.splice(i, 1, `http://localhost:${port}${link}`);
    }
    return null;
  });
  return checkIfUnique(parseLinks);
}

export async function getAllLinkResponses(allLinks) {
  const config = {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    decompress: false,
  };
  const linksAxiosGet = allLinks.map((link) => axios.head(link, config));
  const promisesResolved = linksAxiosGet.map((promise) => promise.catch((error) => ({ error })));
  // eslint-disable-next-line max-len,no-return-await
  return await axios.all(promisesResolved).then(axios.spread((...responses) => responses.map((response) => response)));
}

export async function getAllImageResponses(allImages) {
  const RIS = allImages.map((link) => requestImageSize(link));
  return RIS.map((promise) => promise.catch((error) => ({ error })));
}

// TODO: Namesto responses daj notri datas, preden das podatke notri jih
//  standardiziraj v standardno obliko
// TODO: ki jo funckija podpira. (trenutno je koda duplicirna)
export function findWithRegex(responses, map, regex) {
  const array = [];
  if (map) {
    responses.map((response) => {
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
      return null;
    });
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

// TODO: One time useage warning
export function findAllImages(responses) {
  const find = findWithRegex(responses, true, imagesRegex);
  return parse(find);
}

// TODO: One time useage warning
export function findAllLinks(responses) {
  // FIND ALL LINKS
  const findLinks = findWithRegex(responses, true, linksRegex);

  return parse(findLinks);
}

// TODO: Config
export async function getSitemapURLS() {
  let sitemap = [];
  await axios.get(`${localHost}/sitemap.xml`)
    .then((response) => {
      sitemap = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return sitemap;
}

// TODO: One time useage warning
export function replaceWithLocalhost(routes) {
  const replacedArray = [];
  routes.map((route) => {
    const replace = route.replace('https://programerski-klub.si//', `http://localhost:${port}/`);
    replacedArray.push(replace);
    return null;
  });
  return replacedArray;
}

// TODO: One time useage warning
export const findAllRoutes = (sitemap) => {
  // FIND ALL ROUTES
  const routes = findWithRegex(sitemap, false, routesRegex);

  return replaceWithLocalhost(routes);
};

// TODO: Standardna oblika argsa, returna
export function findEmptySRCandHREF(responses) {
  // FIND ALL EMPTY SRC AND HREF STRINGS
  const URL = [];
  let i = 0;

  responses.map((response) => {
    // SEARCH WITH REGEX
    let result;
    result = emptySRCHREFregex.exec(response.data);
    while (result) {
      const trim = result[1].trim();
      if (trim.length === 0) {
        URL.push(response.config.url);
        i += 1;
      }
      result = emptySRCHREFregex.exec(response.data);
    }
    return null;
  });
  return { i, URL };
}

// GET ALL ROUTE LINKS AND IMAGES
export async function returnArrays() {
  // GET ALL SITEMAP URLs
  sitemapRoutes = findAllRoutes(await getSitemapURLS());
  // TODO: Links for non image
  await axios.all(sitemapRoutes.map((routes) => axios.get(routes)))
    .then(axios.spread((...responses) => {
      // TODO: For loop and write logic for one reqest only.
      // TODO: One requetst you get status and data
      // TODO: Call easy functions that get only basic types.
      // TODO: Base on the return value you eather console log error or pass.
      // FIND ALL IMAGES WITH REGEX
      images = findAllImages(responses);
      // FIND ALL THE LINKS WITH REGEX
      links = findAllLinks(responses);
      // FIND ALL EMPTY SRC AND HREF STRINGS WITH REGEX
      emptyStrings = findEmptySRCandHREF(responses);
    }));
  return { links, images, emptyStrings };
}

// WARNING: !!!
export function writeResultsToFile(testResults, name) {
  fs.writeFile(
    `tests/${name}.json`,

    JSON.stringify(testResults, null, 1),

    (err) => {
      if (err) {
        console.error('Error writing file');
      }
    },
  );
}

export function checkForURLlength(responses) {
  const testResults = [];
  // IF URL LENGTH > 0 , FOUND AN EMPTY HREF OR SRC
  if (responses.URL.length !== 0) {
    responses.URL.map((url) => {
      console.log(`found empty tag in: ${responses.URL}`);
      testResults.push(`found empty tag in: ${url}`);
      return null;
    });
    writeResultsToFile(testResults, 'findEmptyTags');
  }
}
