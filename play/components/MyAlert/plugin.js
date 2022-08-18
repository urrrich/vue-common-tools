import { renderComponent } from '@lib'
import MyAlert from './index.vue'

let alertInstance

export default function createAlert(app) {
  if(!alertInstance) {
    alertInstance = renderComponent({
      component: MyAlert, 
      attrs: {},
      app
    })

    app.config.globalProperties.$alert = (title, message) => {
      alertInstance.setProps({
        title,
        message
      }).show()
    }
  }
}
