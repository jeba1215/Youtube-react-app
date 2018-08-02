import React, { Component } from 'react';
import './YouTubeCard.css'
import 'bootstrap/dist/css/bootstrap.min.css';

class YoutubeCard extends Component {

	render(){
		return (
			<div className="YoutubeCard">
				<div className="thumbnail-with-text">
					<img src={this.props.videoItem.thumbnails.medium.url}></img>
					<br/>
					<span className="videotitle"> {this.props.videoItem.title} </span>
					<br/> 
					<span className="videochannel"> {this.props.videoItem.channel} </span>
					<br/>
					<span className="videodate"> {this.props.videoItem.date} </span>
					<br/>
				</div>
			</div>	
			);
	}
}


class YoutubeCardGrid extends Component {

	// TODO the last row of videos aren't shown at the moment, fix this later
	split_videos_into_rows(videos){
		let columns = 4
		let num_rows = Math.floor(videos.length / columns)
		let rest = videos.length % columns
		let i_item = 0
		
		// Iterate over all of the rows 
		let result_items = []
		for(let i=0; i<num_rows; i++){
			let cells = []
			for(let j=0; j<columns; j++){
				let colmd = "col-md-" + ( 12 / columns )
				cells.push((<div className={colmd}> <YoutubeCard key={"cell"+i_item} videoItem={videos[i_item]}></YoutubeCard> </div>))
				i_item += 1
			}
			
			let row = (<div key={"row"+i_item} className="row">{cells} </div>)
			result_items.push(row)
		}

		return (<div className=""> {result_items} </div>)
	}

	getListOfVideoItems(){
		return this.split_videos_into_rows(this.props.videoItems)
	}


	render() {
		return (
			<div className="YoutubeCardGrid">
				{this.getListOfVideoItems()}
			</div>
			);
	}

}

export default YoutubeCardGrid;

