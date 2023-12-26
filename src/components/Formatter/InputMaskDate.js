import React from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import { add } from 'date-fns';

export default function InputMaskDate(props) {
  const { inputRef, onChange, ...inputMaskProps } = props;

  const beforeMaskedValueChange = (newState, oldState, userInput) => {
    var { value } = newState;
    var selection = newState.selection;
    var cursorPosition = selection ? selection.start : null;

    function incrementCursorPosition() {
      cursorPosition++;
      selection = { start: cursorPosition, end: cursorPosition };
    }

    if (value.charAt(3) > 1 || (value.charAt(3) !== '_' && value.charAt(4) === '_' && userInput === '/')) {
      // Pad month with zero if greater than Jan (it is definitely not Nov or Dec)
      // Or, if user enters '1/' pad with zero to make it Jan
      incrementCursorPosition();
      value = value.substring(0, 3).concat(0).concat(value.substring(3));
      // eslint-disable-next-line
    } else if (Number(value.charAt(3)) !== 0 && Number(value.charAt(4)) > 2) {
      // Pad month with zero if greater than Dec (13 +) and push second digit to the day
      incrementCursorPosition();
      value = value.substring(0, 3).concat(0).concat(value.substring(3));
    } else if (value.charAt(0) > 3 || (value.charAt(1) !== '_' && value.charAt(1) === '_' && userInput === '/')) {
      // Pad day with zero if greater than 3
      // Or, if user enters single digit day with a '/' pad with zero
      incrementCursorPosition();
      value = '0'.concat(value);
      // eslint-disable-next-line
    } else if (value.charAt(0) === 3 && value.charAt(1) > 1) {
      // Pad day with zero if greater than 31 and push second digit to the year
      incrementCursorPosition();
      value = '0'.concat(value);
    } 
    else if (value.charAt(0) !== '2' && value.charAt(7) !== '_' && value.charAt(9) === '_') {
      // Check case where we might have a date in format m/d/yyyy or m/dd/yyyy
      var year = '';
      var md = '';
      for (var i = value.length - 1; i >= 0; i--) {
        if (value.charAt(i).match(/\d/)) {
          if (year.length === 4) {
            md = value.charAt(i).concat(md);
          } else {
            year = value.charAt(i).concat(year);
          }
        }
      }
      year = parseInt(year, 10);
      const MAX_YEAR = add(new Date(), { years: 1 }).getFullYear();
      const MIN_YEAR = MAX_YEAR - 100;
      if (year > MIN_YEAR && year <= MAX_YEAR) {
        incrementCursorPosition();
        if (md.length === 3) {
          // format is mm/d/yyyy
          value = md.substring(3, 5).concat('/0').concat(md.charAt(5)).concat(year);
        } else {
          // length is 2, format is m/d/yyyy
          incrementCursorPosition();
          value = '0'.concat(md.charAt(3)).concat('/0').concat(md.charAt(4)).concat(year);
        }
      }
    }

    return {
      value,
      selection,
    };
  };

  return (
    <InputMask
      {...inputMaskProps}
      inputRef={inputRef}
      placeholder="MM/DD/YYYY"
      mask="99/99/0999"
      onChange={onChange}
      beforeMaskedValueChange={beforeMaskedValueChange}
      formatChars={{ 9: '[0-9*]', 0: '[1-9*]' }}
    />
  );
}

InputMaskDate.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};
