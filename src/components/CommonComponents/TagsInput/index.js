import React, { PureComponent } from 'react';
import { Text, TouchableOpacity, FlatList } from 'react-native';

import inlineStyles from './styles';
import PepoApi from '../../../services/PepoApi';
import CustomTextInput from './CustomTextInput';

const MAX_LENGTH = 500;

class TagsInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: this.props.initialValue,
      keyword: ''
    };
    this.reqTimer = 0;
    this.wordIndex = -1;
    this.indexWord = null;
    this.isTrackingStarted = false;
  }

  fetchHashTags = (keyword) => {
    clearTimeout(this.reqTimer);
    const reqParam = keyword.substr(1);
    this.reqTimer = setTimeout(() => {
      if (!reqParam) return;
      new PepoApi('/tags')
        .get('q=' + reqParam)
        .then((res) => {
          this.openSuggestionsPanel(res);
        })
        .catch((error) => {});
    }, 300);
  };

  getWordAtIndex(str, pos) {
    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(/\S+$/),
      right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
      return str.slice(left);
    }
    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);
  }

  onChangeText = (val) => {
    const location = this.location - 1,
      currentIndexChar = val.charAt(location),
      isValidChar = this.isValidChar(currentIndexChar),
      wordAtIndex = this.getWordAtIndex(val, location),
      isHashTag = this.isHashTag(wordAtIndex);
    if (isValidChar && isHashTag) {
      this.wordIndex = location;
      this.indexWord = wordAtIndex;
      this.startTracking();
      this.fetchHashTags(wordAtIndex);
    } else {
      this.closeSuggestionsPanel();
    }
    this.changeValue(val);
  };

  changeValue = (val) => {
    let maxLength = this.props.maxLength || MAX_LENGTH;
    if (val.length <= maxLength) {
      this.setState({
        value: val
      });
      this.props.onChangeVal(val);
    }
  };

  isHashTag(val) {
    const hastagRegex = /(?:\s|^)#[A-Za-z0-9\-\.\_]+(?:\s|$)/g;
    return hastagRegex.test(val);
  }

  isValidChar(val) {
    const spaceRegex = /\s/g;
    return val && !spaceRegex.test(val);
  }

  locationGetter = (event) => {
    this.location = event && event.nativeEvent && event.nativeEvent.selection && event.nativeEvent.selection.start;
  };

  openSuggestionsPanel(res) {
    if (!this.isTrackingStarted) return;
    if (res && res.data && res.data.tags) {
      this.setState({ data: res.data.tags });
    }
  }

  closeSuggestionsPanel() {
    this.stopStracking();
    if (this.state.data.length > 0) {
      this.setState({ data: [] });
    }
  }

  startTracking() {
    this.isTrackingStarted = true;
  }

  stopStracking() {
    this.isTrackingStarted = false;
  }

  _keyExtractor = (item, index) => `id_${item.id}`;

  _renderItem = ({ item }) => {
    const SearchResultRowComponent = this.props.searchResultRowComponent;
    return (
      <TouchableOpacity onPress={() => this.onSuggestionTap(item)}>
        <SearchResultRowComponent val={item.text} />
      </TouchableOpacity>
    );
  };

  onSuggestionTap(item) {
    this.closeSuggestionsPanel();
    const wordToReplace = this.getWordAtIndex(this.state.value, this.wordIndex),
      isHashTag = this.isHashTag(wordToReplace);
    if (isHashTag) {
      const startIndex = this.getStartIndex(this.state.value, this.wordIndex),
        endIndex = this.getEndIndex(this.state.value, this.wordIndex),
        replaceString = ` #${item.text} `,
        newString = this.replaceBetween(startIndex, endIndex, replaceString);
      this.changeValue(newString);
    }
  }

  replaceBetween(start, end, replaceString) {
    return this.state.value.substring(0, start) + replaceString + this.state.value.substring(end);
  }

  getStartIndex(text, index) {
    let startIndex = index,
      charAtIndex = text.charAt(index);
    while (charAtIndex && this.isValidChar(charAtIndex)) {
      --startIndex;
      if (startIndex < 0) {
        startIndex = 0;
        break;
      }
      charAtIndex = text.charAt(startIndex);
    }
    return startIndex;
  }

  getEndIndex(text, index) {
    let endIndex = index,
      charAtIndex = text.charAt(index),
      maxIndex = text.length;
    while (charAtIndex && this.isValidChar(charAtIndex)) {
      ++endIndex;
      if (endIndex >= maxIndex) break;
      charAtIndex = text.charAt(endIndex);
    }
    return endIndex;
  }

  render() {
    return (
      <FlatList
        keyboardShouldPersistTaps={'always'}
        horizontal={this.props.horizontal}
        enableEmptySections={true}
        data={this.state.data}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        ListHeaderComponent={
          <CustomTextInput
            textInputStyles={this.props.textInputStyles}
            value={this.state.value}
            submitEvent={() => {
              this.props.submitEvent(this.state.value);
            }}
            locationGetter={this.locationGetter}
            onChangeText={this.onChangeText}
            placeholderText={this.props.placeholderText}
            autoFocus={this.props.autoFocus}
          />
        }
        stickyHeaderIndices={[0]}
      />
    );
  }
}

export default TagsInput;
