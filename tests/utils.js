import requestImageSize from 'request-image-size';
import axios from 'axios';
import https from 'https';
import size from 'http-image-size';

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
  const uniqueArray = array.filter((c, index) => {
    return array.indexOf(c) === index;
  });

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

  return axios.all(promisesResolved)
    .then(axios.spread((...responses) => responses.map((response) => response)));
}

export async function getAllImageResponses(allImages) {
  return size('http://localhost:5173/favicon.png', async (err, dimensions) => dimensions);
}

export function findWithRegex(responses, regex) {
  const array = [];
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
  return array;
}

export function fromArrayToString(responses) {
  // GET ALL DATA FROM RESPONSES SAVE IN ARRAY AND CONVERT TO STRING
  const data = [];
  responses.map((response) => {
    data.push(response.data);
    return null;
  });
  return data;
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

// TODO: One time usage warning
export function replaceWithLocalhost(routes) {
  const replacedArray = [];
  routes.map((route) => {
    const replace = route.replace('https://programerski-klub.si//', `http://localhost:${port}/`);
    replacedArray.push(replace);
    return null;
  });
  return replacedArray;
}

// --------------------------------------------------------------------
// TODO: Standardna oblika argsa, returna
export function findEmptySRCandHREF(responses) {
  // FIND ALL EMPTY SRC AND HREF STRINGS
  const URL = [];
  responses.map((response) => {
    // SEARCH WITH REGEX
    let result;
    result = emptySRCHREFregex.exec(response.data);
    while (result) {
      const trim = result[1].trim();
      if (trim.length === 0) {
        URL.push(response.config.url);
      }
      result = emptySRCHREFregex.exec(response.data);
    }
    return null;
  });
  return URL;
}

// GET ALL ROUTE LINKS AND IMAGES
export async function returnArrays() {
  // GET ALL SITEMAP URLs

  sitemapRoutes = replaceWithLocalhost(findWithRegex(await getSitemapURLS(), routesRegex));
  // TODO: Links for non image
  await axios.all(sitemapRoutes.map((routes) => axios.get(routes)))
    .then(axios.spread((...responses) => {
      // TODO: For loop and write logic for one reqest only.
      // TODO: One requetst you get status and data
      // TODO: Call easy functions that get only basic types.
      // TODO: Base on the return value you eather console log error or pass.
      // FIND ALL IMAGES WITH REGEX
      images = parse(findWithRegex(fromArrayToString(responses), imagesRegex));
      // FIND ALL THE LINKS WITH REGEX
      links = parse(findWithRegex(fromArrayToString(responses), linksRegex));
      // links = findAllLinks(responses);
      // FIND ALL EMPTY SRC AND HREF STRINGS WITH REGEX
      emptyStrings = findEmptySRCandHREF(responses);
    }));
  return { links, images, emptyStrings };
}

export function checkForURLlength(responses) {
  // IF URL LENGTH > 0 , FOUND AN EMPTY HREF OR SRC
  if (responses.length !== 0) {
    responses.map((response) => {
      console.log(`found empty tag in: ${response}`);
      return null;
    });
  } else {
    console.log('No empty href or src tags found!');
  }
}
