import Typography from 'typography'
import OceanBeach from 'typography-theme-ocean-beach'

// OceanBeach.overrideThemeStyles = () => {
//   return {
//     'a.gatsby-resp-image-link': {
//       boxShadow: 'none'
//     }
//   }
// }

// delete OceanBeach.googleFonts

const typography = new Typography(OceanBeach)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
