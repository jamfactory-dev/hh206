import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/layout"
import PrivateRoute from "../components/private-route"
import Profile from "../components/profile"
import Login from "../components/login"
import NewPassword from "../components/new-password"

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/profile" component={Profile} />
      <Login path="/app/login" />
      <NewPassword path="/app/new-password" />
    </Router>
  </Layout>
)

export default App
