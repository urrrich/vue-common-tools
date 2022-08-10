import { getCurrentInstance, onUnmounted } from 'vue'
import { renderComponent } from '../src'

export default function useMyAlert() {

  const instance = getCurrentInstance()
  let myAlert

  onUnmounted(() => {
    myAlert?.destory()
  })


  const showAlert = async (title, message) => {
    if(!myAlert) {
      myAlert = renderComponent({
        component: (await import('./MyAlert.vue')).default, 
        attrs: {},
        instance
      })
    }
    myAlert.setProps({
      title,
      message
    }).show()
  }

  return {
    showAlert
  }
  
}