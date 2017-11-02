import React, { Component } from 'react';
import firebase from '../../firebase.js';
import axios from 'axios';
import MyAccountListings from './MyAccountListings/MyAccountListings.js'





class MyAccount extends Component {
    constructor(props) {
        super(props)

        this.state = { posts: [] }
        


    }



    componentWillMount() {


        firebase.auth().onAuthStateChanged(user => {
            if (user) {

                console.log(user);
                this.setState({ successEmail: user.email })
            }

            const uid = user.uid


            axios.get('/api/getUserPosts/' + uid).then((response) => {
                let posts = response.data

                this.setState({ posts })

            })

        })



    }

    handleDeletePost(post_id){
        console.log(post_id)
        axios.delete('/api/deletePost/' + post_id)
    }

    render() {
        return (
            <div>
                <h1>My Account </h1>
                <MyAccountListings posts={this.state.posts} onDelete={this.handleDeletePost.bind(this)}/>
            </div>
        )
    }


}


export default MyAccount;

