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
        'part': 'snippet',
        'maxResults': 50,
        'pageToken':pageToken
      }).then(function(response){
        console.log("nextPageToken:", response.result.nextPageToken, response)
        
        var results = []
        response.result.items.forEach(function(item){ results.push(item.snippet.resourceId.channelId) })
        console.log(subscriptions.length, " + ", results.length, " = ", subscriptions.concat(results).length)
        
        if(response.result.nextPageToken){
          getAllSubscriptions(response.result.nextPageToken, subscriptions.concat(results))
        } else {
          // All subscriptions accumulated, all_subscriptions is an array of channelIds, we will use this to
          // get all the most recent uploads for each channel.
          var all_subscriptions = subscriptions.concat(results)
          console.log("You're subscribed to ", all_subscriptions.length, " channels, ", all_subscriptions)
          getUploadPlaylistFromChannelIds(all_subscriptions, all_subscriptions.length)
        }
      });
    }
    
    function getUploadPlaylistFromChannelIds(ids){
      // Use the channel contentDetails.relatedPlaylists.uploads resource to access the channels uploads.
      // Then use the playlist section
      
      var array_of_promises = []
      //ids.forEach(function(id){
      for(var i=0; i<8; i++){
        array_of_promises.push(
          new Promise(function(resolve, reject){
            window.gapi.client.youtube.channels.list({
              'id': ids[i],
              'part': 'snippet,contentDetails'
            }).then(function(response){
              resolve(response.result.items[0].contentDetails.relatedPlaylists.uploads)
            })
          }
        ))
      }
      
      Promise.all(array_of_promises).then(function(playlistIds){
        getVideosFromPlaylistIds(playlistIds)
      })
    }
    
    function getVideosFromPlaylistIds(ids){
      var array_of_promises = []

      for(var i=0; i<ids.length; i++){
        array_of_promises.push(new Promise(function(resolve, reject){
          window.gapi.client.youtube.playlistItems.list({
            'maxResults': '10',
            'part': 'snippet',
            'playlistId': ids[i]
          }).then(function(response){
            var video_array = []
            response.result.items.forEach(function(videoItem){
              var videoData = {}
              videoData.id = videoItem.snippet.resourceId.videoId
              videoData.date = videoItem.snippet.publishedAt
              videoData.title = videoItem.snippet.title
              videoData.desc = videoItem.snippet.description
              videoData.channel = videoItem.snippet.channelTitle
              videoData.thumbnails = videoItem.snippet.thumbnails
              
              video_array.push(videoData)
            })

            resolve(video_array)
          })
        }))
      }
      
      Promise.all(array_of_promises).then(function(videoData){
        var merged_array = [].concat.apply([], videoData);

        merged_array.sort(function(a, b){
          return Date.parse(a.date) - Date.parse(b.date)
        })

        // Use the sorted merged array to create "cards" and render with react. 
        // Send one videoData object to each YoutubeCard class. 
        console.log(merged_array)
      })
    }
    
    var arrayOfVideoObjects = []
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
