import React, { Component } from 'react';
import CardImages from '../../constants/cardImages';
import CardValues from '../../constants/cardValues';
import RemoveDuplicates from '../../constants/removeDuplicates';
import axios from 'axios';
import CurrentPlayer from '../../APIs/getCurrentPlayer';
import {Redirect } from 'react-router';
import '../Common/style.css';

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
			hostPlayer: null,
			showDeclare: true,
			redirect: null
		}
	}

	async componentDidMount() {

		this.getMyCards();

		// setInterval(() => {

		CurrentPlayer(this.props.gameId, localStorage.getItem('GameUserId'), (currentPlayer, cardsInHand, isRoundComplete, isGameComplete, hostPlayer) => {
			cardsInHand = RemoveDuplicates(cardsInHand)
			if (isRoundComplete === true || isGameComplete === true) {
				this.setState({
					myTurn: false
				})
			} else if (currentPlayer === localStorage.getItem('GameUserId')) {
				this.setState({
					myTurn: true,
					showDeclare: true
				})
				for (var index in cardsInHand) {
					if (cardsInHand[index] !== this.state.currentCards[index]) {
						this.setState({
							currentCards: cardsInHand
						})
						break
					}
				}
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

		// }, 250)
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
				} else {
					temp = [e.target.id]
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
		if (this.state.selected === undefined || this.state.selected.length === 0) {
			return
		}
		const selectedCards = this.state.selected
		this.setState({
			selected: []
		})
		const reqBody = {
			gameId: this.props.gameId,
			userId: localStorage.getItem('GameUserId'),
			selected: selectedCards,
			type: "New"
		}
		axios.post(`/player/dropCards`, reqBody)
			.then(() => {
				this.setState({
					// currentCards: response.data.currentCards,
					selected: []
				})
			})
			.catch(() => {
				this.setState({
					selected: selectedCards
				})
			})
	}

	dropCardAndPickUpFromTop = () => {
		if (this.state.selected.length === 0) {
			return
		}
		const selectedCards = this.state.selected
		this.setState({
			selected: []
		})
		const reqBody = {
			gameId: this.props.gameId,
			userId: localStorage.getItem('GameUserId'),
			selected: selectedCards,
			type: "Top"
		}
		axios.post(`/player/dropCards`, reqBody)
			.then(() => {
				this.setState({
					// currentCards: response.data.currentCards,
					selected: []
				})
			})
			.catch(() => {
				this.setState({
					selected: selectedCards
				})
			})
	}

	dropCardAndPickUpFromDeck = () => {
		if (this.state.selected.length === 0) {
			return
		}
		const selectedCards = this.state.selected
		this.setState({
			selected: []
		})
		const reqBody = {
			gameId: this.props.gameId,
			userId: localStorage.getItem('GameUserId'),
			selected: selectedCards,
			type: "Deck"
		}
		axios.post(`/player/dropCards`, reqBody)
			.then(() => {
				this.setState({
					// currentCards: response.data.currentCards,
					selected: []
				})
			})
			.catch(() => {
				this.setState({
					selectCard: selectedCards
				})
			})
		this.setState({
			showDeclare: false
		})
	}

	leaveGame = () => {
        const reqBody = {
            gameId: this.props.gameId,
            userId: localStorage.getItem('GameUserId')
        }
        axios.post(`/game/quitFromGame`, reqBody)
            .then(() => {
                this.setState({
                    redirect: <Redirect to="/joinGame" />,
                })
            })
    }

	declare = () => {
		this.setState({
			showDeclare: false
		})
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

	startNewGame = () => {
		const reqBody = {
			gameId: this.props.gameId
		}
		axios.post(`/game/restart`, reqBody)
		.then((response) => {
			this.setState({
				currentCards: response.data.createdUserCards
			})
		})
	}

	render() {
		if (this.state.redirect) {
			return (this.state.redirect)
		}
		
		if (this.state.currentCards === undefined || this.state.currentCards.length === 0) {
			if (this.state.isRoundComplete === true && this.state.hostPlayer === localStorage.getItem('GameUserId')) {
				if (this.state.isGameComplete === true) {
					return (
						<div>
							<a href="/joinGame">
								<button className="btn btn-danger" onClick={this.leaveGame}>Close game</button>
							</a>
							<div>
								<button className="btn btn-success mt-5" onClick={this.startNewGame}>Start new game</button> :
							</div>
						</div>
					)
				} else {
					return (
						<div className="p-5 m-5 text-center">
							<button className="btn btn-success" onClick={this.startNextRound}>Start next round</button>
						</div>
					)
				}
			} else {
				return (null)
			}
		}

		let cardNames = []
		let total = 0
		let temp = []
		for (var card of this.state.currentCards) {
			total += CardValues(card)
			if (this.state.selected.includes(card.toString())) {
				// cardNames.push(<p onClick={this.selectCard} id={card} className="text-danger showPointer">{CardNames[card]}</p>)
				temp.push(
					<div className="col-md-4 bg-warning p-1">
						<img src={CardImages[card]} alt="card" style={{ width: 100 + "%" }} onClick={this.selectCard} className="showPointer" id={card} />
					</div>
				)
			} else if (this.state.myTurn === true) {
				// cardNames.push(<p onClick={this.selectCard} id={card} className="showPointer">{CardNames[card]}</p>)
				temp.push(
					<div className="col-md-4 p-1">
						<img src={CardImages[card]} alt="card" style={{ width: 100 + "%" }} onClick={this.selectCard} className="showPointer" id={card} />
					</div>
				)
			} else {
				temp.push(
					<div className="col-md-4 p-1" key={card}>
						<img src={CardImages[card]} alt="card" style={{ width: 100 + "%" }} className="showPointer"/>
					</div>
				)
			}
			if (temp.length === 3) {
				cardNames.push(
					<div className="row mb-2" key={total}>
						{temp}
					</div>
				)
				temp = []
			}
			// cardNames.push(<img onClick={this.selectCard} id="asdasd" src="/loading.gif" />)
		}
		if (temp.length > 0) {
			cardNames.push(
				<div className="row mb-2" key={total}>
					{temp}
				</div>
			)
			temp = []
		}

		return (
			<div className="p-5">
				<div>{cardNames}</div>
				{
					this.state.myTurn === true ?
						<div>
							<img src="/upArrow.gif" style={{ maxWidth: 30 + "px" }} alt="upArrow" /> <span className="text-warning">Select cards</span>
						</div> :
						null
				}
				{
					this.state.currentCards.length === 0 || this.state.myTurn === false ?
						null :
						this.state.currentCards.length === 6 && this.state.selected.length === 0 ?
							<button className="btn btn-success" disabled>Drop card(s)</button> :
							this.state.currentCards.length === 6 ?
								<button className="btn btn-success" onClick={this.dropCard}>Drop card(s)</button> :
								this.state.selected.length === 0 ?
									<div>
										<p className="pt-3">
											<button className="btn btn-success" disabled>Drop card(s) and pick up from the table</button>
										</p>
										<p className="pt-3">
											<button className="btn btn-info" disabled>Drop card(s) and pick up from deck</button>
										</p>
									</div> :
									<div>
										<p className="pt-3">
											<button className="btn btn-success" onClick={this.dropCardAndPickUpFromTop}>Drop card(s) and pick up from the table</button>
										</p>
										<p className="pt-3">
											<button className="btn btn-info" onClick={this.dropCardAndPickUpFromDeck}>Drop card(s) and pick up from deck</button>
										</p>
									</div>
				}
				{/* <p>Timer: {this.state.seconds}</p> */}
				<p className="font-weight-bold">Total: {total}</p>
				{
					total < 15 && this.state.myTurn === true && this.state.showDeclare === true ?
						<button className="btn btn-warning" onClick={this.declare}>Declare</button> :
						this.state.currentCards.length === 2 && (this.state.currentCards[0] - this.state.currentCards[1]) % 13 === 0 && this.state.myTurn === true ?
							<button className="btn btn-warning" onClick={this.declare}>Declare</button> :
							null
				}
				{
					this.state.isGameComplete === true ?
						<div>
							<div>
								<a href="/joinGame">
									<button className="btn btn-danger" onClick={this.leaveGame}>Close game</button>
								</a>
							</div>
							{
								this.state.hostPlayer === localStorage.getItem('GameUserId') ?
									<div>
										<button className="btn btn-success mt-5" onClick={this.startNewGame}>Start new game</button> :
									</div>:
									null
							}
						</div> :
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