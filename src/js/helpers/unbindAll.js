import createdComponents from '../consts/createdComponents'

export default function unbindAll() {
  createdComponents.forEach(component => component.destroy())
  createdComponents.length = 0
}
