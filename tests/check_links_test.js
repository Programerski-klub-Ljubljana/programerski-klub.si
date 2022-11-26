import {assert} from 'chai';
import requestImageSize from 'request-image-size';
import {
  checkIfUnique,
  findWithRegex,
  returnArrays,
  port,
  routesRegex,
  replaceWithLocalhost,
  parse,
  findEmptySRCandHREF,
  linksRegex,
  imagesRegex,
  getAllLinkResponses,
  getAllImageResponses,
  checkForURLlength,
  fromArrayToString, localHost, emptyStringsRegex, url
} from './utils.js';

let imagesAndLinks = [];
describe('Test images and links', () => {

  beforeEach(async () => {
    imagesAndLinks = await returnArrays();
  });

  it('Should test all links', async () => {

    const responses = await getAllLinkResponses(imagesAndLinks.links);

    let i = 0;
     responses.map((response) => {
       try {
         assert.equal(response.status,200, 'height must be greater than zero');
         i += 1;
       } catch(err) {
         assert.isOk(false, response.error.code + ' at: ' + imagesAndLinks.links[i]);
         i += 1;
       }
    });
  });

  it('Should test all image sizes', async () => {

    const imagesResonses = await getAllImageResponses(imagesAndLinks.images)
    let i = 0;
    for (const image of imagesResonses) {
      const res = await image
      try {
        assert(res.height > 0, 'height must be greater than zero');
        i += 1;
      } catch(err) {
        assert.isOk(false, res.error + ' at: ' + imagesAndLinks.images[i] );
        i += 1;
      }
    }
  })
  it("Should test for empty src and href strings", () => {

    const responses = imagesAndLinks.emptyStrings;
    // CHECK IF RESPONSE URLS ARRAY IS NOT EMPTY , LOG AND WRITE TEST RESULTS FO FILE
    checkForURLlength(responses)
    // BOTH MUST EQUAL TO 0 IF NO EMPTY TAGS WERE FOUND
    assert.equal(responses.length, 0);
  });
});
describe('UNIT tests', () => {
  it("Should test if array items are not duplicates", () => {
    const array = ['/content#', '/src/image.jpg', '/content#'];
    const expectedArray = ['/content#', '/src/image.jpg'];
    assert.deepEqual(checkIfUnique(array), expectedArray);
  })
  it("Should test all client routes with regex ", async () => {
    const XMLContent = '<url><loc>https://programerski-klub.si//</loc></url> <url> <loc>https://programerski-klub.si//clani/danijelkorbar</loc></url>'
    const expectedRegexCatch = [url, `${url}clani/danijelkorbar`];
    assert.deepEqual(findWithRegex(XMLContent, routesRegex), expectedRegexCatch);
  })

  it("Should test all links in client routes with regex ", () => {
    const XMLContent1 = {
      data:
        '<link href="../_app/immutable/assets/Vizitka-1d278f3e.css" rel="stylesheet">' +
        '<a href="https://github.com/danilojezernik" class="svelte-sj2pja">Git: danilojezernik</a>' +
        '<a href    = " / content# " class="svelte-sj2pja">Content</a>'
    }

    const responses = [XMLContent1];
    const expectedRegexCatch = ['../_app/immutable/assets/Vizitka-1d278f3e.css', 'https://github.com/danilojezernik', ' / content# '];
    // BEFORE FIND WITH REGEX, CONVERT RESPONSES DATA ARRAY => STRING
    assert.deepEqual(findWithRegex(fromArrayToString(responses), linksRegex), expectedRegexCatch);

  })
  it("Should test all images from client routes with regex ", () => {
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
    // BEFORE FIND WITH REGEX, CONVERT RESPONSES DATA ARRAY => STRING
    assert.deepEqual(findWithRegex(fromArrayToString(responses), imagesRegex), expectedRegexCatch);
  })

  it("Should test parsing of all links from client routes page", () => {
    const links = [
      '/games/racer#content',
      './_app/immutable/assets/_page-e5f94684de.css',
      '../_app/immutable/assets/_page-e5f94684.css',
      '../../_app/immutable/assets/_page-090371f3.css',
      'https://github.com/Programerski-klub-Ljubljana'

    ];
    const expectedArray = [
      `${localHost}games/racer#content`,
      `${localHost}_app/immutable/assets/_page-e5f94684de.css`,
      `${localHost}_app/immutable/assets/_page-e5f94684.css`,
      `${localHost}_app/immutable/assets/_page-090371f3.css`,
      'https://github.com/Programerski-klub-Ljubljana'
    ];
    parse(links)
    assert.deepEqual(parse(links),expectedArray);
  })
  it("Should test parsing of all client routes", () => {
    const routes = [
      `${url}clani/danilojezernik`,
      `${url}clani/danijelkorbar`];
    const exptectedArray = [
      `${localHost}clani/danilojezernik`,
      `${localHost}clani/danijelkorbar`];
    assert.deepEqual(replaceWithLocalhost(routes), exptectedArray);
  })
  it("Should test for empty src and href strings", () => {

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
    // must NOT capture
    const XMLContent4 = {
      data: '<img src = "content#" rel="icon" alt=""/> ',
      config: {


        url: 'content4'
      }
    }
    const responses = [XMLContent1, XMLContent2, XMLContent3, XMLContent4]
    const find = findEmptySRCandHREF(responses, emptyStringsRegex)
    assert.equal(find.length, 4);
  })

})
