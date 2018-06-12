import React, { Component } from 'react';
import logo from './logo.svg';
import YoutubeCard from './YoutubeCard/YoutubeCard';

class App extends Component {
  
  componentDidMount(){
    console.log("component mounted")
    console.log("window.gapi:", window.gapi)
  }
  
  handleClick(){
    
    function getAllSubscriptions(pageToken, subscriptions){
      window.gapi.client.youtube.subscriptions.list({
        'mine': 'true',
        'part': 'snippet,contentDetails',
        'maxResults': 50,
        'pageToken':pageToken
      }).then(function(response){
        console.log("nextPageToken:", response.result.nextPageToken, response)

        var results = []
        response.result.items.forEach(function(item){ results.push(item.snippet.channelId) })
        console.log(subscriptions.length, " + ", results.length, " = ", subscriptions.concat(results).length)

        if(response.result.nextPageToken){
          getAllSubscriptions(response.result.nextPageToken, subscriptions.concat(results))
        } else {
          // All subscriptions accumulated, all_subscriptions is an array of channelIds, we will use this to
          // get all the most recent uploads for each channel.
          var all_subscriptions = subscriptions.concat(results)
          console.log("You're subscribed to ", all_subscriptions.length, " channels, ", all_subscriptions)
          getVideosFromChannelId(all_subscriptions)
        }
      });
    }

    function getVideosFromChannelId(ids){
      // Use the channel contentDetails.relatedPlaylists.uploads resource to access the channels uploads.
      // Then use the playlist section
      window.gapi.client.youtube.channels.list({

      })
    }
    
    getAllSubscriptions("", [])


  }
  
  render() {
    return (
      <div className="App">
      App
      <YoutubeCard></YoutubeCard>
      <button onClick={this.handleClick}>React Button</button>
      </div>
    );
  }
}

export default App;
