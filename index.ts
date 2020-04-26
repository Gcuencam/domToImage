const createSvg = (width: number, height: number, nodeContent: Node) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', width.toString())
  svg.setAttribute('height', height.toString())
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  foreignObject.setAttribute('width', width.toString())
  foreignObject.setAttribute('height', height.toString())
  foreignObject.appendChild(nodeContent)
  svg.appendChild(foreignObject)
  return svg
}

const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

const drawInCanvas = (canvas: HTMLCanvasElement, image: HTMLImageElement, x: number, y: number, w: number, h: number) => {
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, x, y, w, h, 0, 0, w, h)
}

const createLink = (canvas: HTMLCanvasElement, name: string) => {
  const link = document.createElement('a')
  link.download = name
  link.href = canvas.toDataURL("image/jpg")
  return link
}

const domToImage = (node: HTMLElement) => {
  const html = document.querySelector('html')
  const htmlClone = html.cloneNode(true)
  const htmlWidth = html.offsetWidth
  const htmlHeight = html.offsetHeight
  const nodeWidth = node.offsetWidth
  const nodeHeight = node.offsetHeight
  const rect = node.getBoundingClientRect()
  const svg = createSvg(htmlWidth, htmlHeight, htmlClone)
  const data = new XMLSerializer().serializeToString(svg)
  const image = new Image()
  image.onload = () => {
    const canvas = createCanvas(nodeWidth, nodeHeight)
    drawInCanvas(canvas, image, rect.x, rect.y, nodeWidth, nodeHeight)
    const link = createLink(canvas, 'enagas.png')
    link.click()
  }
  image.src = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(data)
}

export default domToImage