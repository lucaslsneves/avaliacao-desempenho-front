import { extendTheme } from "@chakra-ui/react"
// 2. Add your color mode config
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const theme = extendTheme({ config , fonts: {
  heading: "Inter",
  body: "Inter"
} })

export default theme