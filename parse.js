
class YouzParser {
    constructor() {
        this.input_data_string = null;
        this.patterns = [];
        this.definitions = {};
        this.stopWords = [];
        this.keywords = [];
        this.temp_vars = {};
        this.collections = {};
        this.collection_patterns = {};
        this.lastMatchedPattern = null; // متغیر برای ذخیره پرانتز آخرین دستور
    }

    parse(input) {
        this.discover_collections(input);
        this.input_data_string = input;
        const definitionRegex = /#(\S+)\s*:\s*(.*?)\s*\./gs;
        let match;
        while ((match = definitionRegex.exec(input)) !== null) {
            const key = match[1].trim();
            const value = match[2].trim();
            this.definitions[key] = value;
        }

        const patternRegex = /\(\s*\+\s*(.*?)\s*-\s*(.*?)\s*\)/gs;
        while ((match = patternRegex.exec(input)) !== null) {
            const userPattern = match[1].trim();
            const botResponses = match[2].split('_').map(response => response.trim());
            if (userPattern.startsWith('{')) {
                const keywords = userPattern.slice(1, -1).split('،').map(keyword => keyword.trim());
                this.keywords.push({ keywords, botResponses });
            } else {
                this.patterns.push({ userPattern, botResponses });
            }
        }

        const stopWordsRegex = /-\s*\{\s*(.*?)\s*\}/gs;
        while ((match = stopWordsRegex.exec(input)) !== null) {
            const words = match[1].split('،').map(word => word.trim());
            this.stopWords.push(...words);
        }
        //console.log(this.patterns);
        //this.check_for_temp_vars();
    }

    getResponse(userMessage) {

        const cleanedMessage = this.removeStopWords(userMessage);
        this.lastMatchedPattern = null; // ریست کردن متغیر قبل از هر جستجو

        for (let pattern of this.patterns) {
            const { userPattern, botResponses } = pattern;
            const regexPattern = this.createRegex(userPattern);
            const match = cleanedMessage.match(regexPattern);
            if (match) {
                this.lastMatchedPattern = { userPattern, botResponses }; // ذخیره پرانتز
                let responses = botResponses;
                let response = responses[Math.floor(Math.random() * responses.length)];
                if (response.endsWith('!>')) {
                    response = this.getAdditionalResponses(response.slice(0, -99).trim(), cleanedMessage);
                    response = response.replace('!>', '');
                }
                return this.resolveResponse(response, match);
            }
        }

        const messageWords = cleanedMessage.split(' ');
        for (let keywordPattern of this.keywords) {
            const { keywords, botResponses } = keywordPattern;
            if (this.containsKeywords(messageWords, keywords)) {
                this.lastMatchedPattern = { keywords, botResponses }; // ذخیره پرانتز
                let response = botResponses[Math.floor(Math.random() * botResponses.length)];
                if (response.endsWith('!>')) {
                    response = this.getAdditionalResponses(response.slice(0, -99).trim(), cleanedMessage);
                }
                return this.resolveResponse(response, []);
            }
        }

        return "متاسفم، متوجه نشدم.";
    }

    removeStopWords(message) {
        let words = message.split(' ');
        words = words.filter(word => !this.stopWords.includes(word));
        return words.join(' ');
    }

    createRegex(pattern) {
        return new RegExp(`^${pattern.replace(/\*([0-9]*)/g, '(.*?)')}$`);
    }

    resolveResponse(response, match) {
        let resolvedResponse = response;
        for (let i = 1; i < match.length; i++) {
            resolvedResponse = resolvedResponse.replace(`*${i}`, match[i].trim());
        }
        return resolvedResponse.replace(/#(\S+)/g, (match, key) => {
            return this.definitions[key] || match;
        });
    }

    containsKeywords(messageWords, keywords) {
        return keywords.every(keyword => messageWords.includes(keyword));
    }

    getAdditionalResponses(initialResponse, userMessage) {
        let additionalResponses = initialResponse;
        for (let pattern of this.patterns) {
            const { userPattern, botResponses } = pattern;
            const regexPattern = this.createRegex(userPattern);
            const match = userMessage.match(regexPattern);
            if (match) {
                const responses = botResponses;
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                additionalResponses += " " + this.resolveResponse(randomResponse, match);
            }
        }
        return additionalResponses;
    }

    /* _return_temp_vars_name_and_val(input) {
         //console.log(input);
         let lines = input.split('\n');
         let temp_vars_obj = {};
         for (let line of lines) {
             line = line.trim();
             let words_seperated = line.split(' ');
             for (let i = 0; i < words_seperated.length; i++) {
                 let word = words_seperated[i];
                 let first_char = word[0];
                 if (first_char === '=') {
                     let temp_var_name = word.slice(1, word.length);
                     let next_word = words_seperated[i + 1];
                     if (next_word === ':') {
                         let value = words_seperated[i + 2];
                         temp_vars_obj[temp_var_name] = value;
                     }
                 }
             }
         }
         return temp_vars_obj;
     } */
    _is_temp_var_declaration_line(line) {
        line = line.trim();
        let words_seperated = line.split(' ');
        let first_word = words_seperated[0];
        let first_char = first_word[0];
        let next_word = words_seperated[1];
        if (first_char === '=' && next_word === ':') { return true; }
        else { return false; }
    }
    /*
    _replace_temp_vars_with_values(input, temp_vars_name_and_value_obj) {
        let lines = input.split('\n');
        let result_text = '';
        for (let line of lines) {
            let is_declaration_line = this._is_temp_var_declaration_line(line);
            if (is_declaration_line) { continue; }
 
            let words_seperated = line.split(' ');
            for (let i = 0; i < words_seperated.length; i++) {
                let word = words_seperated[i];
                let first_char = word[0];
                if (first_char === '=') {
                    let temp_var_name = word.slice(1, word.length);
                    let value = temp_vars_name_and_value_obj[temp_var_name];
                    result_text += value + ' ';
                }
                else {
                    result_text += word + ' ';
                }
            }
            result_text += '\n';
        }
        return result_text;
    }
    check_for_temp_vars(input) {
        let temp_vars_name_and_value_obj = this._return_temp_vars_name_and_val(input)
        let result_text = this._replace_temp_vars_with_values(input, temp_vars_name_and_value_obj);
        console.log(result_text);
        return result_text;
    }*/
    define_temp_vars(text) {
        let lines = text.split('\n');
        for (let line of lines) {
            line = line.trim();
            let is_declaration_line = this._is_temp_var_declaration_line(line);
            if (is_declaration_line) {
                let chunks = line.split(' ');
                let first_chunk = chunks[0];
                let last_chunk = chunks[2];
                let var_name = first_chunk.slice(1, first_chunk.length);
                let value = last_chunk.trim();
                this.temp_vars[var_name] = value;
            }
        }
        //console.log(this.temp_vars);
    }
    replace_temp_vars(response) {
        let lines = response.split('\n');
        let result_text = '';
        for (let line of lines) {
            line = line.trim();
            let is_declaration_line = this._is_temp_var_declaration_line(line);
            if (!is_declaration_line) {
                let chunks = line.split(' ');
                for (let chunk of chunks) {
                    let first_char = chunk[0];
                    if (first_char === '=') {
                        let var_name = chunk.slice(1, chunk.length);
                        console.log(var_name);
                        result_text += this.temp_vars[var_name] + ' ';
                    }
                    else { result_text += chunk + ' '; }
                }
            }
            result_text += '\n';
        }
        //console.log(result_text);
        return result_text;
    }
    _is_answer_part(line) {
        let first_char = line[0];
        if (first_char === '-') { return true; } else { return false; }
    }/*
    discover_collection_patterns(input) {
        let lines = input.split('\n');
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line.includes('&')) {
                for (let j = i; j < lines.length; j++) {
                    let is_answer_part = this._is_answer_part(lines[j]);
                    if (is_answer_part) {
                        let the_line = lines[j];
                        let dash_index = the_line.indexOf('-');
                        let answer = the_line.slice(dash_index, the_line.length);
                        this.collection_patterns[line] = answer;
                        break;
                    }
                }
            }
        }
    }*/
    discover_collections(input) {
        //let lines = input.split('\n');
        let open_parenthis = false;
        let outside_text = '';
        let parenthis_depth = 0;
        for (let i = 0; i < input.length; i++) {
            let char = input[i];
            if (char === '(') { open_parenthis = true; parenthis_depth++; }
            else if (char === ')') {
                parenthis_depth--;
                if (parenthis_depth === 0) { open_parenthis = false; continue; }
            }

            if (open_parenthis) { continue; }
            else { outside_text += char; }
        }
        //console.log(outside_text)
        let lines = outside_text.trim().split('\n');
        //console.log(lines);
        for (let line of lines) {
            if (line.includes('{')) {
                let start_index = line.indexOf('{');
                let end_index = line.indexOf('}');
                let between = line.slice(start_index + 1, end_index);
                let items = between.split('،');
                for (let i = 0; i < items.length; i++) { items[i] = items[i].trim(); }
                let collection_name = line.slice(0, start_index).trim();
                //console.log(items);
                this.collections[collection_name] = items;
            }
        }
    }
    check_for_collections_pattern(messageText) {
        let chunks = messageText.trim().split(' ');
        let collection_entries = Object.entries(this.collections);
        let result_text = '';
        for (let chunk of chunks) {
            let is_in_collections = false;
            for (let [key, vals_arr] of collection_entries) {
                if (vals_arr.includes(chunk)) {
                    is_in_collections = key;
                    break;
                }
            }
            if (is_in_collections) { result_text += '&' + is_in_collections + ' '; }
            else { result_text += chunk + ' '; }
        }
        return result_text.trim();
    }
}

let youzParser = new YouzParser();
let inputCode = `
(
+ اسم شما چیست ؟ .
- اسم من یوز است .
)
`;
const userMessage1 = "اسم شما چیست ؟ .";

youzParser.parse(inputCode);


// دریافت پاسخ بر اساس پیام ورودی کاربر
const response1 = youzParser.getResponse(userMessage1);
console.log(response1);