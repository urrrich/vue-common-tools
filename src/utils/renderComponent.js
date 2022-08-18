import { createVNode, render } from 'vue'


export const renderComponent = ({ component, el, app, attrs }) => {
  if (!el) {
    el = document.createElement('div')
    document.body.appendChild(el)
  }
  const vnode = createVNode(component, attrs)
  const context = app?.appContext || app?._context
  if(context) {
    if(app?.provides) {
      context.provides = app.provides
    }
    vnode.appContext = context
  }
  render(vnode, el)

  const _this = {
    destory: () => {
      render(null, el)
    },
    setProps: (props) => {
      Object.entries(props).forEach(([key, value]) => {
        if (/^on/.test(key)) {
          vnode.props[key] = value
        } else {
          vnode.component.props[key] = value
        }
      })
      return _this
    },
    ...vnode.component?.exposed
  }

  return _this
}
