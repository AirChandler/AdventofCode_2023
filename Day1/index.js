const fs = require('fs');

const getCalibrationDocumentText = ( filePath ) =>
{
    try {
        const text = fs.readFileSync(filePath);
        return text;
    } catch (error) {
        console.error("Error trying to read document text: " + error.message);
    }
}

const getCalibrationNumbersFromString = (input_text) =>
{
    const strNumbersArr = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
    const regExNumberStr = new RegExp("(?=(\\d|"+strNumbersArr.join('|')+"))", "gi");

    return input_text.split('\n').filter(line => line !== "").map((curLine, idx) =>
        {
            // Iterate through all literal and string represented number occurances, and construct array of converted literal numbers.
            // Includes Overlapping Matches.
            let str_match_arr = Array.from(curLine.matchAll(regExNumberStr), (match) => match[1]);
            let str_num_arr = str_match_arr?.filter(outStrNumArr => outStrNumArr !== null).map((curStr) => 
                {
                        if((new RegExp(strNumbersArr.join('|'), "gi")).test(curStr))
                        {
                            // Convert & return string number as literal.
                            return strNumbersArr.indexOf(curStr.toLowerCase()).toString();
                        }
                        else
                        {
                            // Str is literal number already, return as is.
                            return curStr;
                        }
                });
            console.log(idx, curLine, str_match_arr, str_num_arr);
            return str_num_arr;
        }
    );
}

const getCalibrationValueFromNumbers = (input_numbers) =>
{
    let total = 0;
    input_numbers.map((num_arr, idx) =>
        {
            // Concat 1st/last decimal in arr to form & return a compelete integer
            let calibration_line_value = parseInt(num_arr[0] + num_arr[num_arr.length-1]);
            console.log(total + " += " + calibration_line_value + ", " + idx);
            total += calibration_line_value;
        }
    );
    return total;
}

let calibration_data = getCalibrationDocumentText("./input.txt");
let calibration_numbers = getCalibrationNumbersFromString(calibration_data.toString());
let calibration_value = getCalibrationValueFromNumbers(calibration_numbers);
console.log(calibration_value);