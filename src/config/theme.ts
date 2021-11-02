import { extendTheme } from "@chakra-ui/react"
// 2. Add your color mode config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config , fonts: {
  heading: "Inter",
  body: "Inter"
} })

export default theme