
# js-parse


[![Stars Badge](https://img.shields.io/github/stars/ai-yooz/js-parse?style=social)](https://github.com/ai-yooz/js-parse/stargazers)
[![Forks Badge](https://img.shields.io/github/forks/ai-yooz/js-parse?style=social)](https://github.com/ai-yooz/js-parse/network/members)

## Project Description

`js-parse` is a powerful JavaScript library designed for parsing conversational patterns in chatbots. This library allows you to define complex patterns and generate appropriate responses based on user inputs. With support for stop words, keywords, variables, and word categories, `js-parse` provides a comprehensive toolset for developing intelligent chatbots.

## Features

- **General Definitions:** Define general terms using the `#` symbol.
- **Conversational Patterns:** Define question and response patterns with support for variables (`*1`, `*2`, etc.).
- **Stop Words:** Remove unnecessary words from user inputs.
- **Keywords:** Identify and respond based on a set of keywords.
- **Additional Responses:** Append multiple responses using `!>`.
- **Word Categories:** Define categories like pronouns and verbs and use them in patterns with `&`.
- **Support for Multiple Variables:** Use multiple variables in patterns and replace them in responses.

## Installation

First, clone the repository:

```bash
git clone https://github.com/ai-yooz/js-parse.git
```

Navigate to the project directory:

```bash
cd js-parse
```

Install the necessary packages:

```bash
npm install
```

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
    - My name is Youz.
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
console.log(response1);  // Output: "My name is Youz."

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
    - My name is Youz.
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

**Bot Response:** `My name is Youz.`

### Using Variables

**User Input:** `My name is Aria.`

**Bot Response:** `Nice to meet you, Aria.`

### Using Categories

**User Input:** `I went.`

**Bot Response:** `You used a pronoun and a verb.`

### Additional Responses

**User Input:** `Tell me about yourself.`

**Bot Response:** `I'm good. Thank you`

## Contribution

Your contributions are highly valued! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/NewFeature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature/NewFeature`).
6. Open a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or suggestions, feel free to reach out:

- **Email:** [your-email@example.com](mailto:your-email@example.com)
- **GitHub:** [https://github.com/ai-yooz/js-parse](https://github.com/ai-yooz/js-parse)

## Acknowledgements

Thank you to all contributors and users who help improve this project!

---

**Developer:** [Your Name](https://github.com/ai-yooz)

**Repository Link:** [https://github.com/ai-yooz/js-parse](https://github.com/ai-yooz/js-parse)
