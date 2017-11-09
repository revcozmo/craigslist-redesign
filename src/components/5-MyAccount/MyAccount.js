import React, { Component } from 'react';
import firebase from '../../firebase.js';
import axios from 'axios';
import MyAccountListings from './MyAccountListings/MyAccountListings.js'
import Favorites from './Favorites/Favorites'
import { withRouter, Link } from 'react-router-dom';

import LoginModal from '../Navbar/LoginModal/LoginModal';


class MyAccount extends Component {
    constructor(props) {
        super(props)

        this.state = {
            posts: [],
            listFav: true,
            fav: false,
            list: true,
            favorites: [],
            modal: false


        }

        this.changeView = this.changeView.bind(this);
        this.unFavorite = this.unFavorite.bind(this);

    }



    componentWillMount() {


        firebase.auth().onAuthStateChanged(user => {

            if (user) {

                this.setState({ successEmail: user.email })


            const uid = user.uid
            this.setState({uid})

            axios.get('/api/getUserPosts/' + uid).then((response) => {
                let posts = response.data

                this.setState({ posts })

            })

            axios.get('/api/getFavorites/' + uid).then((response) => {
                console.log(response)
                let favorites = response.data

                this.setState({ favorites })

            })


        }


        })


    }

    // componentDidMount(){
    //   document.getElementById('list-item-delete').addEventListener('click', this.unFavorite)
    // }

    handleDeletePost(postInfo){
        // let post_id = postInfo.post_id
        // let uid = postInfo.uid


        axios.post('/api/deletePost', postInfo).then((response) => {

            let posts = response.data

            this.setState({ posts })
        })
        // this.setState({posts})
    }

    changeView(){
      console.log('show on click')
      console.log(this)
      this.setState({
          listFav: true
      })
    }

    changeViews(){
      console.log('show on click')
      console.log(this)
      this.setState({
          listFav: false
      })
    }



    unFavorite(favs){
            let uid = favs.uid
            let that = this;
            console.log(favs.post_id);

            document.getElementById(`heart-${ favs.post_id }`).style.transform = 'translateY(-30px) scale(4)';
            document.getElementById(`heart-${ favs.post_id }`).style.opacity = '0';

            setTimeout(function(){
              axios.post('/api/removeFav', favs).then((response) => {
                      // console.log(response)
                      // let favorites = response.data

                      // this.setState({ favorites })

                  axios.get('/api/getFavorites/' + uid).then((response) => {

                      let favorites = response.data

                      that.setState({ favorites })

                   })
              })

              document.getElementById(`heart-${ favs.post_id }`).style.transform = 'translateY(0) scale(1)';
              document.getElementById(`heart-${ favs.post_id }`).style.opacity = '1';

            }, 550)

    }

    callBack() {

    }



    handleSignout(event) {
      const user = this.state.successEmail
      firebase.auth().signOut().then(() => {
        console.log(user, 'Signed Out');
        this.props.history.push('/');
        console.log(this.props)
      })
    }

    render() {
        console.log(this.state.successEmail)
        return (
            <div >
                <h2>{this.state.successEmail}</h2>
                <h1>My Account </h1>

               <div>
                 <button onClick={ (event) => this.handleSignout(event) }>Sign out</button>

               </div>

                <div className="filter-container">
                  <div className="category-filter" onClick={(event) => this.changeView(event)}>
                  My posts
                </div>
                  <div>|</div>
                <div onClick={(event) => this.changeViews(event)}>
                  Favorites
                </div>
                </div>


                <div>
                {this.state.listFav ?
                    <MyAccountListings posts={this.state.posts} onDelete={this.handleDeletePost.bind(this)}/>
                :
                    <Favorites favorites={this.state.favorites}  onRemoveFav={this.unFavorite.bind(this)}/>
                }
                </div>
            </div>
        )
    }


}


export default withRouter(MyAccount);
