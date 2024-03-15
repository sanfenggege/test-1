import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';

import { Navbar } from './app/Navbar';
import { PostsList } from './app/features/posts/PostsList';
import { AddPostForm } from './app/features/posts/AddPostForm';
import { SinglePostPage } from './app/features/posts/SinglePostPage';
import { EditPostForm } from './app/features/posts/EditPostForm';
import { UsersList } from './app/features/users/UsersList';
import { UserPage } from './app/features/users/UserPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                {/* todo: */}
                {/* <AddPostForm/> */}
                {/* <Link to="/addPost" className="button">
                  App Post
                </Link> */}
                <PostsList />
              </React.Fragment>
            )}
          />
          <Route exact path="/posts/:postId" component={SinglePostPage} />
          <Route exact path="/users/:userId" component={UserPage} />
          <Route exact path="/editPost/:postId" component={EditPostForm} />
          <Route exact path="/addPost" component={AddPostForm} />
          <Route exact path="/users" component={UsersList} />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
