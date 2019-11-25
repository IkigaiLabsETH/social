import React, { PureComponent } from 'react';
import inlineStyles from './styles';
import { Text, View, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';

import DataContract from '../../../constants/DataContract';
import PepoApi from "../../../services/PepoApi";
import deepGet from "lodash/get";
import ProfilePicture from "../../ProfilePicture";
import reduxGetter from "../../../services/ReduxGetters";
import multipleClickHandler from '../../../services/MultipleClickHandler';

//
const NO_OF_ITEMS_TO_SHOW = 3;

class BubbleList extends PureComponent {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
    this.getDataWhileLoading();
    this.onClickHandler = this.props.onClickHandler || this.defaultClickHandler;
  }

  componentDidUpdate(prevProps, prevState ) {
    if( this.props.doRender && this.props.doRender !== prevProps.doRender  ){
      this.getListData();
    }

  }

  getDataWhileLoading(){
    if (this.props.doRender){
      this.getListData();
    }
  };

  getListData = () => {
    return new PepoApi(this.getFetchUrl())
      .get()
      .then((apiResponse) => {
        if (apiResponse.success ){
          let result_type = deepGet(apiResponse, DataContract.common.resultType),
            list = deepGet(apiResponse, `data.${result_type}` ),
            listToShowOnUI = list.slice(0,NO_OF_ITEMS_TO_SHOW);
            this.replyCount =  reduxGetter.getVideoReplyCount(this.props.videoId)
            this.setState({ list : listToShowOnUI } );
        }

      })
      .catch((err) => {
        console.log(err);
      });

  };


  getFetchUrl = () => {
    return `/videos/${this.props.videoId}/replies`;
  };


  getBubbleListJSX = () => {
    let listToRender = this.state.list;
    return listToRender.length?listToRender.map((item) => {
      let userId = deepGet(item,'payload.user_id');
      return <View style={[inlineStyles.bubbleShadow, {marginLeft: -20}]}>
        <ProfilePicture userId={userId}
                        style={inlineStyles.bubbleSize}
        />
      </View>
    }): <></> ;
  };

  moreReplyText = () => {

    let list = this.state.list;
    if (! this.replyCount || ! list.length){
      return ''
    }
    if (this.replyCount > list.length){
      return ` + ${this.replyCount - list.length} Replies`;
    }
  };

  defaultClickHandler= ()=> {
    const baseUrl = DataContract.replies.getReplyListApi(this.props.videoId);
    this.props.navigation.push('FullScreenReplyCollection',{
      "baseUrl": baseUrl
    });
  }

  render() {
    return <View style={inlineStyles.bubbleContainer}>
        <TouchableOpacity onPress={multipleClickHandler(() => {this.onClickHandler()})} 
             style={{flexDirection: 'row-reverse', marginRight: 5}}>{this.getBubbleListJSX()}
        </TouchableOpacity>
        <Text style={inlineStyles.repliesTxt}>{this.moreReplyText()}</Text>
      </View>
  }
}


//make this component available to the app
export default withNavigation(BubbleList);
