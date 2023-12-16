import type { Node } from 'gatsby'

interface VideoNode extends Node {
  dir: string
  base_name: string
  label: string
  year: string
  image: string
}
