import axios from 'axios';
import https from 'https';
import requestImageSize from 'request-image-size';

let emptyStrings = [];
let sitemapRoutes = [];
let images = [];
let links = [];

export const imagesRegex = /\b(?:href|src)\s*=\s*"\s*([^"]*(?:\.png|\.jpg|\.bmp|\.jpeg|\.gif))\s*"/gm;
export const emptyStringsRegex = /\b(?:href|src)\s*=\s*"\s*([^"]*)\s*"/gm;
export const linksRegex = /href\s*=\s*"(.*?)"/gms;
export const routesRegex = /<loc>(.*?)</gm;

export const url = 'https://programerski-klub.si//';
export const port = '5173';
export const localHost = `http://localhost:${port}/`;
console.log(`testing at ${localHost}`);

export function checkIfUnique(array) {
  return array.filter((c, index) => array.indexOf(c) === index);
}

export function parse(parseLinks) {
  const regex = /[../]+/;
  parseLinks.map((link, i) => {
    link = link.replace(regex, '/');
    if (link.charAt(0) === '.') {
      link = link.replace('.', '');
    }
    if (link.includes('tel:')) {
      parseLinks.splice(i, 1);
    }
    if (link.charAt(0) === '/') {
      link = link.slice(1);
      parseLinks.splice(i, 1, localHost + link);
    }
    return null;
  });
  return checkIfUnique(parseLinks);
}

export async function getAllLinkResponses(allLinks) {
  const config = {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }), decompress: false,
  };
  const linksAxiosGet = allLinks.map((link) => axios.head(link, config));
  const promisesResolved = linksAxiosGet.map((promise) => promise.catch((error) => ({error})));
  return axios.all(promisesResolved)
    .then(axios.spread((...responses) => responses));
}

export async function getAllImageResponses(allImages) {
  const RIS = allImages.map((link) => requestImageSize(link));
  return RIS.map((promise) => promise.catch((error) => ({error})));
}

export function findWithRegex(responses, regex) {
  const array = [];
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
  const data = [];
  responses.map((response) => {
    data.push(response.data);
    return null;
  });
  return data.toString();
}

export async function getSitemapURLS() {
  let sitemap = [];
  await axios.get(`${localHost}sitemap.xml`)
    .then((response) => {
      sitemap = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return sitemap;
}

export function replaceWithLocalhost(routes) {
  const replacedArray = [];
  routes.map((route) => {
    const replace = route.replace(url, localHost);
    replacedArray.push(replace);
    return null;
  });
  return replacedArray;
}

//  LEAVING ARGS IN THIS RESPONSE STRUCTURE
//  BECAUSE OF GATHERING URL INFO FROM EVERY HREF AND SRC
export function findEmptySRCandHREF(responses, regex) {
  // FIND ALL EMPTY SRC AND HREF STRINGS
  const URL = [];
  responses.map((response) => {
    // SEARCH WITH REGEX
    let result;
    result = regex.exec(response.data);
    while (result) {
      const trim = result[1].trim();
      if (trim.length === 0) {
        URL.push(response.config.url);
      }
      result = regex.exec(response.data);
    }
    return null;
  });
  return URL;
}

// GET ALL ROUTE LINKS AND IMAGES
export async function returnArrays() {
  // GET ALL SITEMAP URLs
  sitemapRoutes = replaceWithLocalhost(findWithRegex(await getSitemapURLS(), routesRegex));
  await axios.all(sitemapRoutes.map((routes) => axios.get(routes)))
    .then(axios.spread((...responses) => {
      images = parse(findWithRegex(fromArrayToString(responses), imagesRegex));
      links = parse(findWithRegex(fromArrayToString(responses), linksRegex));
      emptyStrings = findEmptySRCandHREF(responses, emptyStringsRegex);
    }));
  return {links, images, emptyStrings};
}

export function checkForURLlength(responses) {
  // IF URL LENGTH > 0 , FOUND AN EMPTY HREF OR SRC
  if (responses.length !== 0) {
    responses.map((response) => {
      console.log(`found empty tag in: ${response}`);
      return null;
    });
  }
}
