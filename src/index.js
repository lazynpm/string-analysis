const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
const vader = require('vader-sentiment');;
const localList = require('./lib/badwords');
const nouns = require('./lib/nouns');
const adjectives = require('./lib/adjectives');
const verbs = require('./lib/verbs');
const baseList = require('badwords-list').array;


const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();


class Analyser {

  /**
  * Analyser constructor.
  * @constructor
  * @param {object} options - Analyze instance options
  * @param {boolean} options.emptyList - Instantiate analyze with no blacklist
  * @param {array} options.list - Instantiate analyze with custom list
  * @param {string} options.placeHolder - Character used to replace profane words.
  * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
  * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
  * @param {string} options.splitRegex - Regular expression used to split a string into words.
  * @param {array} option.adjectives - Add adjectives to current dictionary
  * @param {array} option.nouns - Add nouns to current dictionary
  * @param {array} option.verbs - Add verbs to current dictionary
  */

  constructor(options = {}) {
    Object.assign(this, {
      list: options.emptyList && [] || Array.prototype.concat.apply(localList, [baseList, options.list || []]),
      exclude: options.exclude || [],
      splitRegex: options.splitRegex || /\b/,
      placeHolder: options.placeHolder || '*',
      regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
      replaceRegex: options.replaceRegex || /\w/g,
      listAdjectives: Array.prototype.concat.apply(adjectives, [[], options.adjectives && options.adjectives.map(x => x.toLowerCase()) || []]),
      listNouns: Array.prototype.concat.apply(nouns, [[], options.nouns && options.nouns.map(x => x.toLowerCase()) || []]),
      listVerbs: Array.prototype.concat.apply(verbs, [[], options.verbs && options.verbs.map(x => x.toLowerCase()) || []])
    })
  }

  /**
 * Determine intenstity and analysis of string.
 * @param {string} review - String to evaluate for intentsity.
 */
  analyzeEmotion(review) {
    // negation handling
    // convert apostrophe=connecting words to lex form
    const lexedReview = aposToLexForm(review);

    // casing
    const casedReview = lexedReview.toLowerCase();

    // removing
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    // tokenize review
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    // spell correction
    tokenizedReview.forEach((word, index) => {
      tokenizedReview[index] = spellCorrector.correct(word);
    })

    // remove stopwords
    const filteredReview = SW.removeStopwords(tokenizedReview);

    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

    const analysis = analyzer.getSentiment(filteredReview);

    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(review);

    return {
      analysis,
      intensity
    }
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  isProfane(string) {
    return this.list
      .filter((word) => {
        const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
        return !this.exclude.includes(word.toLowerCase()) && wordExp.test(string);
      })
      .length > 0 || false;
  }

  /**
   * Replace a word with placeHolder characters;
   * @param {string} string - String to replace.
   */
  replaceWord(string) {
    return string
      .replace(this.regex, '')
      .replace(this.replaceRegex, this.placeHolder);
  }

  /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */
  clean(string) {
    return string.split(this.splitRegex).map((word) => {
      return this.isProfane(word) ? this.replaceWord(word) : word;
    }).join(this.splitRegex.exec(string)[0]);
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} word - Word(s) to add to blacklist
   */
  addWords() {
    let words = Array.from(arguments);
    this.list.push(...words);
    words
      .map(word => word.toLowerCase())
      .forEach((word) => {
        if (this.exclude.includes(word)) {
          this.exclude.splice(this.exclude.indexOf(word), 1);
        }
      });
  }

  /**
   * Add words to whitelist filter
   * @param {...string} word - Word(s) to add to whitelist.
   */
  removeWords() {
    this.exclude.push(...Array.from(arguments).map(word => word.toLowerCase()));
  }

  /**
   * Get nouns from a string
   * @param {string} string - String to get nouns from.
   */
  getNouns(string) {
    let words = [];
    string.split(this.splitRegex).map((word) => {
      if(this.listNouns.includes(word.toLowerCase())){
        words.push(word);
      }
    })
    return words;
  }

  /**
   * Get verbs from a string
   * @param {string} string - String to get verbs from.
   */
   getVerbs(string) {
    let words = [];
    string.split(this.splitRegex).map((word) => {
      if(this.listVerbs.includes(word.toLowerCase())){
        words.push(word);
      }
    })
    return words;
  }

  /**
   * Get adjectives from a string
   * @param {string} string - String to get adjectives from.
   */
   getAdjectives(string) {
    let words = [];
    string.split(this.splitRegex).map((word) => {
      if(this.listAdjectives.includes(word.toLowerCase())){
        words.push(word);
      }
    })
    return words;
  }

  /**
   * Get Bad words from a string
   * @param {string} string - String to get Bad words from.
   */
   getBadWords(string) {
    let words = [];
    string.split(this.splitRegex).map((word) => {
      if(this.list.includes(word.toLowerCase())){
        words.push(word);
      }
    })
    return words;
  }

}


module.exports = Analyser;

