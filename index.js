const open = document.querySelector('button[data-type="open"]')
const close = document.querySelector('button[data-type="close"]')
const getGot = document.querySelector('button[data-type="get"]')
const set = document.querySelector('button[data-type="set"]')
const clear = document.querySelector('button[data-type="clear"]')
const destroy = document.querySelector('button[data-type="destroy"]')

const log = document.getElementById('log')
let selected = null

const select = new Select({
  selector: '#select',
  label: 'Выберите технологию',
  url: 'https://vladilen-dev.firebaseio.com/technologies.json',
  onSelect(selectedItem) {
    selected = selectedItem
    log.innerText = `Selected item: ${selectedItem.label}`
  }
})

set.addEventListener('click', (event) => {
  event.stopPropagation()
  select.set(5)
})
open.addEventListener('click', (event) => {
  event.stopPropagation()
  select.open()
})
getGot.addEventListener('click', () => alert(JSON.stringify(selected)))
close.addEventListener('click', (event) => {
  event.stopPropagation()
  select.close()
})
clear.addEventListener('click', (event) => {
  event.stopPropagation()
  select.clear()
})
destroy.addEventListener('click', (event) => {
  event.stopPropagation()
  select.destroy()
})
