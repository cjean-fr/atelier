type JSXNode =
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXElement       // any object with toString()
  | Promise<JSXNode>
  | JSXNode[];
