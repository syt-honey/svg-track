import { input } from './input'

export class DrawLine {
  el: SVGSVGElement | null = null

  targetEvent: { unsubscribe: () => void } | null = null

  path: Line | null = null
  color: string = 'red'
  weight: string = '4'
  fill: string = 'none'

  constructor(el: SVGSVGElement) {
    this.el = el

    this.el.style.color = this.color

    this.targetEvent = input(this.el, {
      start: this.start.bind(this),
      update: this.update.bind(this),
      finish: this.finish.bind(this)
    })
  }

  start(): void {
    this.path = new Line(svg('path'))

    if (this.el && this.path) {
      this.el.append(this.path.path)
    }
  }

  update(ev: PointerEvent): void {
    const { offsetX: x, offsetY: y } = ev

    if (this.path) {
      this.path.update({ x, y })
    }
  }

  finish(): void {
    this.path = null
  }

  destroy(): void {
    if (this.targetEvent) {
      this.targetEvent.unsubscribe()
    }

    this.el = null
  }
}

export class Line {
  path: SVGElement
  last: Point | null = null
  defn: string = ''
  tail: number = 0

  constructor(path: SVGElement) {
    this.path = path
  }

  remove(): void {
    this.path.remove()
  }

  update(point): void {
    if (this.last) {
      if (this.tail) {
        this.defn = this.defn.slice(0, -this.tail)
        this.defn += Q(this.last, mid(this.last, point))
      } else {
        this.defn += L(mid(this.last, point))
      }
      const tail = L(point)
      this.tail = tail.length
      this.defn += tail
      this.path.setAttribute('d', this.defn)
      this.last = point
    } else {
      this.defn = M((this.last = point))
    }
  }
}

export type Point = { x: number; y: number }

export function mid(a, b): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

export const M = ({ x, y }): string => `M${x.toFixed(2)},${y.toFixed(2)}`
export const L = ({ x, y }): string => `L${x.toFixed(2)},${y.toFixed(2)}`
export const Q = (c, { x, y }): string =>
  `Q${c.x.toFixed(2)},${c.y.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`

export function svg(tag = 'svg'): SVGElement {
  return document.createElementNS('http://www.w3.org/2000/svg', tag)
}
