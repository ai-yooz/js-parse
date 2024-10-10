
# js-parse for yooz

![Repo Views](https://visitor-badge.laobi.icu/badge?page_id=ai-yooz.js-parse)
[![Stars Badge](https://img.shields.io/github/stars/ai-yooz/js-parse?style=social)](https://github.com/ai-yooz/js-parse/stargazers)
[![Forks Badge](https://img.shields.io/github/forks/ai-yooz/js-parse?style=social)](https://github.com/ai-yooz/js-parse/network/members)

## Project Description

yooz-ml is a powerful JavaScript library designed for parsing conversational patterns in chatbots. This library allows you to define complex patterns and generate appropriate responses based on user inputs. With support for stop words, keywords, variables, and word categories, yooz-ml provides a comprehensive toolset for developing intelligent chatbots.

## Features

- **General Definitions:** Define general terms using the `#` symbol.
- **Conversational Patterns:** Define question and response patterns with support for variables (`*1`, `*2`, etc.).
- **Stop Words:** Remove unnecessary words from user inputs.
- **Keywords:** Identify and respond based on a set of keywords.
- **Additional Responses:** Append multiple responses using `!>`.
- **Word Categories:** Define categories like pronouns and verbs and use them in patterns with `&`.
- **Support for Multiple Variables:** Use multiple variables in patterns and replace them in responses.

## Usage

### Defining Patterns and Responses

Define your conversational patterns and responses in a string format. Here's an example:

```javascript
const inputCode = `
#Iraq : A country in Western Asia.
verbs {is, was, became, went, came}
pronouns {I, you, he, she, we, they}
(
    + What is your name?
    - My name is yooz.
)
(
    + How are you?
    - I'm good, thanks for asking.
)
(
    + How's it going?
    - Thank you _ I appreciate it _ How about you?
)
(
    + Where is Iraq?
    - #Iraq
)
- {from, to, with, in}
(
    + suitcase
    - Understood
)
(
    + My name is *1.
    - Nice to meet you, *1.
)
(
    + I travel to city *2 *1 times a year.
    - Do you enjoy traveling to city *2 *1 times a year?
)
(
    + {Iraq, country}
    - #Iraq
)
(
    + Tell me about yourself.
    - I'm good !>
)
(
    + &pronoun &verb.
    - You used a pronoun and a verb.
)
`;
```

### Creating an Instance and Parsing

Create an instance of the `YouzParser` class and parse the input patterns:

```javascript
const youzParser = new YouzParser();

// Parse the defined patterns and responses
youzParser.parse(inputCode);
```

### Getting Responses

Retrieve responses based on user messages:

```javascript
const userMessage1 = "What is your name?";
const response1 = youzParser.getResponse(userMessage1);
console.log(response1);  // Output: "My name is yooz."

const userMessage2 = "How's it going?";
const response2 = youzParser.getResponse(userMessage2);
console.log(response2);  // Output: Could be "Thank you", "I appreciate it", or "How about you?"

// ... other user messages and responses
```

## Input Format

### General Definitions

Use the `#` symbol to define general terms:

```
#Iraq : A country in Western Asia.
```

### Word Categories

Define word categories using the category name followed by words in `{}`:

```
verbs {is, was, became, went, came}
pronouns {I, you, he, she, we, they}
```

### Conversational Patterns

Define question and response patterns using `+` for questions and `-` for responses:

```
(
    + What is your name?
    - My name is yooz.
)
```

### Using Variables

Use `*` followed by a number to define variables in patterns and responses:

```
(
    + My name is *1.
    - Nice to meet you, *1.
)
```

### Using Categories

Reference word categories using `&` followed by the category name:

```
(
    + &pronoun &verb.
    - You used a pronoun and a verb.
)
```

### Stop Words

Define stop words using `- {}` to remove unnecessary words from user inputs:

```
- {from, to, with, in}
```

## Examples

### Simple Response

**User Input:** `What is your name?`

**Bot Response:** `My name is yooz.`

### Using Variables

**User Input:** `My name is Aria.`

**Bot Response:** `Nice to meet you, Aria.`

### Using Categories

**User Input:** `I went.`

**Bot Response:** `You used a pronoun and a verb.`

### Additional Responses

**User Input:** `Tell me about yourself.`

**Bot Response:** `I'm good. Thank you`
