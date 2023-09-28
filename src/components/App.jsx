/** @format */

import { Component } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Filter from './filter';
import ContactList from './contactlist';
import ContactForm from './contactform';
import './style.css';

class App extends Component {
	state = {
		contacts: [
			{ id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
			{ id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
			{ id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
			{ id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
		],
		filter: '',
	};

	componentDidMount = () => {
		try {
			const savedContacts = JSON.parse(localStorage.getItem('contacts'));
			if (savedContacts) {
				this.setState({ contacts: savedContacts });
			}
		} catch (error) {
			console.log('🚀', error);
		}
	};

	componentDidUpdate = () => {
		const savedContacts = JSON.stringify(this.state.contacts);
		const localContacts = localStorage.getItem('contacts');
		const matchingСontacts = savedContacts === localContacts;
		if (!matchingСontacts) {
			localStorage.setItem('contacts', savedContacts);
		}
	};

	handlerOnFiltred = ({ target }) => {
		this.setState({
			[target.name]: target.value,
		});
	};

	handleAddContact = ({ name, number }) => {
		const checkName = this.state.contacts.find(
			contact => contact.name.toLowerCase() === name.toLowerCase()
		);
		if (checkName) {
			Notify.failure(`${checkName.name} is already in contacts.`);
			// alert(`${checkName.name} is already in contacts.`);
			return { name, number };
		}
		this.setState(prevState => {
			return {
				contacts: [
					...prevState.contacts,
					{
						id: nanoid(),
						name,
						number,
					},
				],
			};
		});
		return { name: '', number: '' };
	};

	handlerFilter = () => {
		return this.state.contacts.filter(contact => {
			const searchName = contact.name.toLowerCase();
			const filterName = this.state.filter.toLowerCase();
			return searchName.includes(filterName);
		});
	};

	handleDelClick = e => {
		this.setState(prevState => {
			return { contacts: prevState.contacts.filter(contact => contact.id !== e.target.id) };
		});
	};

	render() {
		return (
			<div className='container'>
				<h1 className='title-name'>Phonebook</h1>

				<ContactForm onSubmitForm={this.handleAddContact} />

				<h2 className='title-name'>Contacts</h2>

				<Filter onFiltred={this.handlerOnFiltred} value={this.state.filter} />

				<ContactList
					contacts={this.handlerFilter()}
					onDeleteContact={this.handleDelClick}
				/>
			</div>
		);
	}
}

export default App;
