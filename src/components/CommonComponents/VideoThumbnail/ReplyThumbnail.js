import Base from "./Base";
import React, { PureComponent } from 'react';
import reduxGetters from '../../../services/ReduxGetters';
import AppConfig from '../../../constants/AppConfig';
import deepGet from "lodash/get";

class ReplyThumbnail extends PureComponent {
  constructor(props){
    super(props);
  }

  render(){
    const replyId = deepGet(this.props , "payload.reply_detail_id"),
     userId = deepGet(this.props , "payload.user_id") ,
     videoId = reduxGetters.getReplyEntityId( replyId ),
     userName = reduxGetters.getUserName(userId),
     imageUrl = reduxGetters.getVideoImgUrl(videoId, null,  AppConfig.userVideos.userScreenCoverImageWidth) ,
     videoDesc = reduxGetters.getVideoDescription(reduxGetters.getReplyDescriptionId(videoId))
     ;
    return <Base  userName={userName} imageUrl={imageUrl} videoDesc={videoDesc} {...this.props} />;
  }
}
export default ReplyThumbnail;