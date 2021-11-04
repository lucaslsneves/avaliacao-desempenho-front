import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import "@fontsource/inter"
import * as React from "react"
import ReactDOM from "react-dom"
import { App } from "./App"
import theme from "./config/theme"
import Login from "./pages/login"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import {
  BrowserRouter as Router,
} from "react-router-dom";
import Routes from "./routes"



ReactDOM.render(
  <ChakraProvider theme={theme}>
    <Router  >
      <Routes/>
    </Router>
    <ColorModeScript initialColorMode="dark" />

  </ChakraProvider>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
