import React, { Component } from 'react';
import CardNames from '../../constants/cardNames';
import CardValues from '../../constants/cardValues';
import axios from 'axios';
import CurrentPlayer from '../../APIs/getCurrentPlayer';

class MyCards extends Component {

	constructor() {
		super()
		this.state = {
			currentCards: [],
			selected: [],
			myTurn: false,
			seconds: 10,
			isRoundComplete: false,
			isGameComplete: false,
			hostPlayer: null
		}
	}

	async componentDidMount() {

		this.getMyCards();

		setInterval(() => {

			CurrentPlayer(this.props.gameId, localStorage.getItem('GameUserId'), (currentPlayer, cardsInHand, isRoundComplete, isGameComplete, hostPlayer) => {
				if (isRoundComplete === true || isGameComplete === true) {
					this.setState({
						myTurn: false
					})
				} else if (currentPlayer === localStorage.getItem('GameUserId')) {
					this.setState({
						myTurn: true,
						seconds: 10
					})
				} else {
					this.setState({
						myTurn: false,
						currentCards: cardsInHand,
						selected: []
					})
				}
				this.setState({
					isRoundComplete: isRoundComplete,
					isGameComplete: isGameComplete,
					hostPlayer: hostPlayer
				})
			})

		}, 1000)
	}

	sleep = (s) => {
		var ms = s * 1000
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	startTimer = async () => {
		var count = this.state.seconds
		while (count >= 0) {
			this.setState({
				seconds: count
			})
			await this.sleep(1)
			count--
		}
	}

	getMyCards = () => {
		axios.get(`/player/cards/${this.props.gameId}/${localStorage.getItem('GameUserId')}`)
			.then((response) => {
				this.setState({
					currentCards: response.data.currentCards
				})
			})
	}

	selectCard = (e) => {
		if (this.state.myTurn === false) {
			return
		}
		let temp = this.state.selected
		let index = this.state.selected.indexOf(e.target.id)
		if (index === -1) {
			if (temp.length === 0) {
				temp.push(e.target.id)
			} else {
				var difference = parseInt(e.target.id, 10) - parseInt(temp[0], 10)
				if (difference % 13 === 0) {
					temp.push(e.target.id)
				}
			}
		} else {
			temp.splice(index, 1)
		}
		this.setState({
			selected: temp
		})
	}

	dropCard = () => {
		if (this.state.selected.length === 0) {
			return
		}
		this.setState({
			myTurn: false
		})
		const reqBody = {
			gameId: this.props.gameId,
			userId: localStorage.getItem('GameUserId'),
			selected: this.state.selected,
			type: "New"
		}
		axios.post(`/player/dropCards`, reqBody)
			.then((response) => {
				this.setState({
					currentCards: response.data.currentCards,
					selected: []
				})
			})
	}

	dropCardAndPickUpFromTop = () => {
		if (this.state.selected.length === 0) {
			return
		}
		this.setState({
			myTurn: false
		})
		const reqBody = {
			gameId: this.props.gameId,
			userId: localStorage.getItem('GameUserId'),
			selected: this.state.selected,
			type: "Top"
		}
		axios.post(`/player/dropCards`, reqBody)
			.then((response) => {
				this.setState({
					currentCards: response.data.currentCards,
					selected: []
				})
			})
	}

	dropCardAndPickUpFromDeck = () => {
		if (this.state.selected.length === 0) {
			return
		}
		this.setState({
			myTurn: false
		})
		const reqBody = {
			gameId: this.props.gameId,
			userId: localStorage.getItem('GameUserId'),
			selected: this.state.selected,
			type: "Deck"
		}
		axios.post(`/player/dropCards`, reqBody)
			.then((response) => {
				this.setState({
					currentCards: response.data.currentCards,
					selected: []
				})
			})
	}

	declare = () => {
		const reqBody = {
			gameId: this.props.gameId,
			userId: localStorage.getItem('GameUserId')
		}
		axios.post(`/player/declare`, reqBody)
		this.setState({
			selected: []
		})
	}

	startNextRound = () => {
		const reqBody = {
			gameId: this.props.gameId
		}
		axios.post(`/game/nextRound`, reqBody)
			.then((response) => {
				this.setState({
					currentCards: response.data.createdUserCards
				})
			})
	}

	render() {
		let cardNames = []
		let total = 0
		for (var card of this.state.currentCards) {
			total += CardValues(card)
			if (this.state.selected.includes(card.toString())) {
				cardNames.push(<p onClick={this.selectCard} id={card} className="text-danger">{CardNames[card]}</p>)
			} else {
				cardNames.push(<p onClick={this.selectCard} id={card}>{CardNames[card]}</p>)
			}
			// cardNames.push(<img onClick={this.selectCard} id="asdasd" src="/loading.gif" />)
		}

		return (
			<div>
				<p>{cardNames}</p>
				{
					this.state.currentCards.length === 0 || this.state.myTurn === false ?
						null :
						this.state.currentCards.length === 6 && this.state.selected.length === 0 ?
							<button className="btn btn-success" disabled>Drop card(s)</button> :
							this.state.currentCards.length === 6 ?
								<button className="btn btn-success" onClick={this.dropCard}>Drop card(s)</button> :
								this.state.selected.length === 0 ?
									<div>
										<button className="btn btn-success" disabled>Drop card(s) and pick up from top</button>
										<button className="btn btn-success" disabled>Drop card(s) and pick up from deck</button>
									</div> :
									<div>
										<button className="btn btn-success" onClick={this.dropCardAndPickUpFromTop}>Drop card(s) and pick up from top</button>
										<button className="btn btn-success" onClick={this.dropCardAndPickUpFromDeck}>Drop card(s) and pick up from deck</button>
									</div>
				}
				{/* <p>Timer: {this.state.seconds}</p> */}
				<p>Total: {total}</p>
				{
					total <= 15 && this.state.myTurn === true ?
						<button className="btn btn-warning" onClick={this.declare}>Declare</button> :
						null
				}
				{
					this.state.isGameComplete === true ?
					<a href="/joinGame">
						<button className="btn btn-danger">Close game</button>
					</a>:
					this.state.isRoundComplete === true && this.state.hostPlayer === localStorage.getItem('GameUserId') ?
						<button className="btn btn-success" onClick={this.startNextRound}>Start next round</button> :
						null
				}
			</div>
		);
	}

}
//export MyCards Component
export default MyCards;