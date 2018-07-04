import React, { Component } from 'react';
import './YouTubeCard.css'

class YoutubeCard extends Component {
	constructor(props){
		super(props)
	}

	componentDidUpdate(prevProps){
	}

	render(){
		return (
			<div className="YoutubeCard">
				<div className="thumbnail-with-text">
					<img src={this.props.videoItem.thumbnails.high.url}></img>
					<br/>
					{this.props.videoItem.title}
					<br/>
					{this.props.videoItem.channel}
					<br/>
					{this.props.videoItem.date}
					<br/>
				</div>
			</div>	
			);
	}
}

class YoutubeCardGrid extends Component {
	constructor(props){
		super(props)
	}

	componentDidUpdate(prevProps){
		console.log("videoItem:", this.props.videoItems[0])
	}

	getListOfVideoItems(){
		return this.props.videoItems.map((item) => {
			return <li key={item.id}><YoutubeCard videoItem={item}></YoutubeCard></li>
		})
	}

	render() {
		return (
			<div className="YoutubeCardGrid">
			<ul>{this.getListOfVideoItems()}</ul>
			</div>
			);
	}
}

export default YoutubeCardGrid;
