const _ = require('lodash/fp');
const mapFp = _.map;
const map = require('lodash/map');
const testData = require('./data.json');
require('chai').should();

describe('Functional Programming', () => {
  describe('FP 101', () => {
    it('uses lodash fp', () => {
      map([1, 2, 3], (d) => d * 2).should.eql([2, 4, 6]);
      mapFp((d) => d * 2, [1, 2, 3]).should.eql([2, 4, 6]);
      mapFp(_.multiply(2), [1, 2, 3]).should.eql([2, 4, 6]);
    });

    it('refresh on closure and currying', () => {
      const itAddsThree = (a) => (b) => (c) => a + b + c;
      itAddsThree(1)(2)(3).should.eql(6);

      const itCurrys = _.curry((a, b, c) => a + b + c);
      itCurrys(1)(2)(3).should.eql(6);
      itCurrys(1, 2)(3).should.eql(6);
      itCurrys(1)(2, 3).should.eql(6);
      itCurrys(1, 2, 3).should.eql(6);
    });

    it('functional pipelines', () => {
      // f(g(x)))
      const f = x => x + 1;
      const g = x => x * 5;
      f(g(1)).should.eql(6);
      _.compose(f, g)(1).should.eql(6);

      g(f(1)).should.eql(10);
      _.flow(f, g)(1).should.eql(10);

    });
  });

  describe('Basic Examples', () => {
    const isActive = _.get('isActive')
    const isOver30 = _.flow(
      _.get('age'),
      (age) => age > 30
    )

    const activeOverThirty = _.flow(
      _.filter(_.overEvery([isActive, isOver30])),
      _.map(_.get('name.first'))
    );

    it('first names of isActive=true and age > 30', () => {
      activeOverThirty(testData).should.eql(['Paval']);
    });

    const excludedTags = ['director', 'Software 3'];

    const isExcludedTag = (tag) => _.some(_.isEqual(tag), excludedTags);
    const filterExcludedTags = _.flow(
      _.reject(
        _.flow(
          _.get('tags'),
          _.some(isExcludedTag))
        ),
      _.map('name.first')
    );

    it('first names, reject any with excluded tags', () => {
      filterExcludedTags(testData).should.eql(['Ian']);
    });

    const makeEmailHref = _.flow(
      _.map('email'),
      _.join(';'),
      _.add('mailto:'),
    );
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

    const cleanInput = _.flow(
      _.toLower,
      _.replace(/[\s,!.]/g, '')
    );
    it('should clean input', () => {
      cleanInput('HELLo!!!  ,,,.').should.eql('hello');
    });


    // hint
    // rows = floor of square root of length
    // columns = ceiling of length / rows
    const determineNumberOfColumns = (input) => {
      const length = input.length;
      const columnsFor = _.flow(
        Math.floor,
        Math.sqrt,
        _.divide(length),
        Math.ceil,
      );
      return columnsFor(length);
    };

    it('determine number of columns', () => {
      const checkColumns = _.map(_.flow(cleanInput, determineNumberOfColumns));
      checkColumns(inputs).should.eql([8, 4, 4, 3]);
    });

    const turnIntoSquare = (numberOfColumns) => _.flow(
      _.chunk(numberOfColumns),
      _.map(_.join(''))
    );
    it('turn input into square', () => {
      const input = 'haveaniceday';
      turnIntoSquare(4)(input).should.eql([
        'have',
        'anic',
        'eday'
      ]);
    });

    const fillSpaces = (columns) => {
      return _.map((input) => {
        if(input.length === columns) return input;
        const fillEm = _.flow(
          (input) => columns - input.length,
          _.times(_.always(' ')),
          _.concat(input),
          _.join('')
        )
        return fillEm(input);
      });
    }

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

    // [1, 1, 1]
    // [2, 2, 2]
    // [3, 3, 3]

    // [1, 2, 3]
    // [1, 2, 3]
    // [1, 2, 3]

    const transposeSquare = _.flow(
      _.map(_.toArray),
      _.unzip,
      _.map(_.join(''))
    );

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

    const encode = (input) => {
      const cleanedInput = cleanInput(input);
      const columns = determineNumberOfColumns(cleanedInput);
      const encodeInput = _.flow(
        turnIntoSquare(columns),
        fillSpaces(columns),
        transposeSquare,
        _.join(' ')
      );
      return encodeInput(cleanedInput);
    }
    it('should encode the message', () => {
      _.map(encode, inputs).should.eql(outputs);
    });
  });
});