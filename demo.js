const _ = require('lodash/fp');
const mapFp = _.map;
const map = require('lodash/map');
const testData = require('./data.json');
require('chai').should();

describe('Functional Programming', () => {
  describe('FP 101', () => {
    it('should explain the difference between lodash and lodash/fp', () => {});
    it('refresh on closure and currying', () => {});
    it('functional pipelines', () => {});
  });

  describe('Basic Examples', () => {
    const activeOverThirty = _.identity
    it('first names of isActive=true and age > 30', () => {
      activeOverThirty(testData).should.eql(['Paval']);
    });

    const excludedTags = ['director', 'Software 3'];
    const filterExcludedTags = _.identity

    it('first names, reject any with excluded tags', () => {
      filterExcludedTags(testData).should.eql(['Ian']);
    });

    const makeEmailHref = _.identity
    it('send an email to everybody', () => {
      const expectedResult = 'mailto:ian.pfeffer@pax8.com;chris.smoak@pax8.com;paval.volchak@pax8.com'
      makeEmailHref(testData).should.eql(expectedResult);
    });

  });

  describe('Advanced Example', () => {
    // One classic method for composing secret messages is called a square code.  The spaces are removed from the
    // english test and the characters are written into a square (or rectangle).  For example, the sentence
    // "If man was meant to stay on the ground god would have given us roots" is 54 characters long, so it is written
    // into a rectangle with 7 rows and 8 columns.

    // ifmanwas
    // meanttos
    // tayonthe
    // groundgo
    // dwouldha
    // vegivenu
    // sroots

    // The coded message is obtained by reading down the columns going left to right.
    // For example, the message above is coded as:

    //   imtgdvs fearwer mayoogo anouuio ntnnlvt wttddes aohghn  sseoau

    // In your program, have the user enter a message in english with no spaces between the words.  Have the
    // maximum message length be 81 characters.  Display the encoded message.
    // (Watch out that no "garbage" characters are printed.)    Here are some more examples:

    const inputs = [
      'If man was meant to stay on the ground god would have given us roots',
      'have a nice day!',
      'Feed the dog',
      'Chill OUT!!!'
    ];

    const outputs = [
      'imtgdvs fearwer mayoogo anouuio ntnnlvt wttddes aohghn  sseoau ',
      'hae and via ecy',
      'fto ehg ee  dd ',
      'clu hlt io '
    ]

    const cleanInput = _.identity;
    it('should clean input', () => {
      cleanInput('HELLo!!!  ,,,.').should.eql('hello');
    });


    // hint
    // rows = floor of square root of length
    // columns = ceiling of length / rows
    const determineNumberOfColumns = _.identity;
    it('determine number of columns', () => {
      const checkColumns = _.map(_.flow(cleanInput, determineNumberOfColumns));
      checkColumns(inputs).should.eql([8, 4, 4, 3]);
    });

    const turnIntoSquare = _.always(_.identity);
    it('turn input into square', () => {
      const input = 'haveaniceday';
      turnIntoSquare(4)(input).should.eql([
        'have',
        'anic',
        'eday'
      ]);
    });


    // [1, 1, 1]
    // [2, 2, 2]
    // [3, 3, 3]

    // [1, 2, 3]
    // [1, 2, 3]
    // [1, 2, 3]
    it('explains zip', () => {
      _.zip(
        [1, 2, 3],
        ['a', 'b', 'c'],
      ).should.eql(
        [
          [1, 'a'],
          [2, 'b'],
          [3, 'c']
        ]
      );
    })

    const transposeSquare = _.identity;
    it('should transpose the square', () => {
      const input = [
        'have',
        'anic',
        'eday'
      ];
      transposeSquare(input).should.eql([
        'hae',
        'and',
        'via',
        'ecy'
      ]);
    });

    const fillSpaces = _.always(_.identity);

    it('should fill spaces', () => {
      const unevenInput = [
        'feed',
        'thed',
        'og',
      ];
      fillSpaces(4)(unevenInput).should.eql([
        'feed',
        'thed',
        'og  '
      ]);
    });


    const encode = _.identity;
    it('should encode the message', () => {
      _.map(encode, inputs).should.eql(outputs);
    });

  });
});