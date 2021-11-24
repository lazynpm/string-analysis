
# string-analysis

A combined experience of sentiment analysis, bad-word detection and filteration with power to get adjectives, nouns and verbs from a string.

# Installtion

```bash
npm i string-analysis
```



# Usage

```js
const Analyze = require('string-analysis');
const analyze = new Analyze();
```

# Sentiment Analysis

```js
console.log(analyze.analyzeEmotion("I am testing this package"))
// { analysis: 0, intensity: { neg: 0, neu: 1, pos: 0, compound: 0 } }
```

### Analysis 
- Analysis will have 3 type of values, negative, zero and positive
- Negative means negative emotions
- Positive means positive emotions
- Zero means neutral

### intensity
Intensity cleary states, negative, neutral, positive and compound ratio in a sentence

# Nouns Adjectives and Verbs

### Adding Adjectives, Nouns and verbs to existing list in library
```js
var Analyze = require('string-analysis');
var analyze = new Analyze({ 
    adjectives: ["bashful"], // optional
    nouns: ["car"], // optional
    verbs: ["some verbs"] //optional
});
```

### Get list of nouns
```js
var Analyze = require('string-analysis');
var analyze = new Analyze();
analyze.getNouns("sentence") // returns words array
```

### Get list of Adjectives
```js
var Analyze = require('string-analysis');
var analyze = new Analyze();
analyze.getAdjectives("sentence") // returns words array
```

### Get list of Verbs
```js
var Analyze = require('string-analysis');
var analyze = new Analyze();
analyze.getVerbs("sentence")  // returns words array
```


# Bad Words Detection

## Usage

```js
var Analyze = require('string-analysis'),
    analyze = new Analyze();

console.log(analyze.clean("Don't be an ash0le")); //Don't be an ******
```

### Placeholder Overrides

```js
var Analyze = require('string-analysis');
var analyze = new Analyze({ placeHolder: 'x'});

analyze.clean("Don't be an ash0le"); //Don't be an xxxxxx
```

### Regex Overrides

```js
var analyze = new Analyze({ regex: /\*|\.|$/gi });

var analyze = new Analyze({ replaceRegex:  /[A-Za-z0-9가-힣_]/g }); 
//multilingual support for word filtering
```

### Add words to the blacklist

```js
var analyze = new Analyze(); 

analyze.addWords('some', 'bad', 'word');

analyze.clean("some bad word!") //**** *** ****!

//or use an array using the spread operator

var newBadWords = ['some', 'bad', 'word'];

analyze.addWords(...newBadWords);

analyze.clean("some bad word!") //**** *** ****!

//or

var analyze = new Analyze({ list: ['some', 'bad', 'word'] }); 

analyze.clean("some bad word!") //**** *** ****!
```

### Instantiate with an empty list

```js
var analyze = new Analyze({ emptyList: true }); 
analyze.clean('hell this wont clean anything'); //hell this wont clean anything
```

### Remove words from the blacklist

```js
let analyze = new Analyze(); 

analyze.removeWords('hells', 'sadist');

analyze.clean("some hells word!"); //some hells word!

//or use an array using the spread operator

let removeWords = ['hells', 'sadist'];

analyze.removeWords(...removeWords);

analyze.clean("some sadist hells word!"); //some sadist hells word!
```

### Get list of bad words
```js
let analyze = new Analyze(); 
analyze.getBadWords("Some words that I cannot type here");
// ["","",""]
```

#### Ref. taken for bad-words
Used and tweaked code from https://www.npmjs.com/package/bad-words as per The MIT License (MIT)

## Support

For support, connect with me on Linkedin (https://www.linkedin.com/in/lazycoderr) or twitter (https://twitter.com/lazycoderr).


## Authors

- [@Arpit Sharma](https://github.com/OrignalLazyCoder)


