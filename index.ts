type Options = "filter"
type Option = { [option in Options]: string };

const width = (node: HTMLElement): number => node.offsetWidth
const height = (node: HTMLElement): number => node.offsetHeight

const cloneHTML = () => {
  const node = document.querySelector('html')
  return node && node.cloneNode(true)
}

const createForeignObject = () => {
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  foreignObject.setAttribute('width', '100%')
  foreignObject.setAttribute('height', '100%')
  return foreignObject
}

const createCanvas = (node: HTMLElement, image: HTMLImageElement) => {
  const canvas = document.createElement('canvas')
  canvas.width = width(node)
  canvas.height = height(node)
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
  ctx && ctx.drawImage(image, 0, 0)
  return canvas
}

const createImage = async (uri: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.onerror = reject
    image.src = uri
  })
}

const createSvgURI = (node: HTMLElement): string => {
  const _html: any = cloneHTML()
  if (!node || !_html) return 'false'
  _html.removeChild(_html.querySelector('body'))
  const _node: any = node.cloneNode(true)
  _node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
  _html.appendChild(_node)
  const foreignObject = createForeignObject()
  foreignObject.appendChild(_html)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', width(node).toString())
  svg.setAttribute('height', height(node).toString())
  svg.appendChild(foreignObject)
  return 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(new XMLSerializer().serializeToString(svg))
}

const createLink = (url: string, name: string) => {
  const link = document.createElement('a')
  link.download = name
  link.href = url
  return link
}

const filterNode = (node: HTMLElement, selector: string): HTMLElement => {
  node.querySelectorAll(selector).forEach(n => n.remove());
  return node
}

const domDownloader = async (node: HTMLElement, fileName: string, options: Option) => {
  if (options.filter) {
    node = filterNode(node, options.filter)
  }
  const uri: string = createSvgURI(node)
  try {
    const image = await createImage(uri)
    const canvas = createCanvas(node, image)
    const link = createLink(canvas.toDataURL('image/jpeg', 1.0), fileName)
    link.click()
  } catch (err) {
    console.error(err)
  }
}

export default domDownloader