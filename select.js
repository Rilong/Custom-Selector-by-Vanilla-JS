class Select {
  data = []

  constructor(options) {
    this.options = options
    this.html = document.getElementsByTagName('html')[0]

    if (!options.selector) {
      throw new Error('Selector is empty')
    }

    if(!options.label) {
      throw new Error('label is empty')
    }

    this.container = document.querySelector(options.selector)
    this._init()
    this._fetch()
    this.render()
    this._handle()
  }

  render() {
    this.container.innerHTML = ''
    this.container.appendChild(this.selector)
    this.inputContainer.appendChild(this.input)
    this.inputContainer.appendChild(this.label)
    this.selectorContainer.appendChild(this.inputContainer)
    this.selectorContainer.appendChild(this.dropdownContainer)

    this.container.appendChild(this.selectorContainer)
  }

  open() {
    if (!this._isOpen()) {
      this.selectorContainer.classList.add('open')
      this._focus()
    }
  }

  close() {
    if (this._isOpen()) {
      this.selectorContainer.classList.remove('open')
    }
    if (this.input.value.trim().length === 0) {
      this._unfocus()
    }
  }

  openToggle() {
    if (!this._isOpen()) {
      this.open()
    } else {
      this.close()
    }
  }

  select(index) {
    this.selector.options.selectedIndex = 0

    Object.keys(this.selector.options).forEach(key => {
      this.selector.options.item(+key).removeAttribute('selected')
    });

    this.selector.options.item(index).setAttribute('selected', 'selected')
    this.selector.options.selectedIndex = index

  }

  set(index) {
    this._focus()
    this._activeSelector()
    const elem = this.li.filter((current_elem) => +current_elem.dataset.item === +index)[0]
    this.li.map(current => current.classList.remove('active'))
    elem.classList.add('active')
    this.input.value = ''
    this.input.value = elem.innerText
    this.select(index)
    this.options.onSelect(this.getSelected())
  }

  getSelected() {
    return this.input.value.trim() ? this.data[this.selector.options.selectedIndex] : null
  }

  clear() {
    this.data = []
    this.close()
    this._unfocus()
    this._fillDropdown(this.data)
    this._activeSelector(false)
    this.input.value = ''
    this.selectorContainer.classList.add('cleared')
  }

  destroy() {
    this.container.remove()
  }

  _init() {
    this.selectorContainer = document.createElement('div')
    this.inputContainer = document.createElement('div')
    this.selectorContainer.classList.add('selector')
    this.inputContainer.classList.add('input_container')
    this._createSelector(this.data)
    this._createInput()
    this._createLabel(this.options.label)
    this._createDropdown()
    this._fillDropdown(this.data)
  }

  _createSelector(data) {
    this.selector = document.createElement('select')
    data.forEach((value, index) => this.selector.add(new Option(value, index)))
    this.selector.style.display = 'none'
  }

  _createInput(value = '') {
    this.input = document.createElement('input')
    this.input.type = 'text'
    this.input.readOnly = true
    this.input.value = value
  }

  _createLabel(text) {
    this.label = document.createElement('label')
    this.label.innerText = text
  }

  _createDropdown() {
    this.dropdownContainer = document.createElement('ul')
    this.dropdownContainer.classList.add('dropdown_select')
  }

  _fillDropdown(data) {
    this.li = []
    this.dropdownContainer.innerHTML = ''
    data.forEach((item, index) => {
      const li = document.createElement('li')
      li.classList.add('dropdown_item')
      li.dataset.item = index
      li.innerText = item.label
      this.li.push(li)
      this.dropdownContainer.appendChild(li)
    })
  }

  _isOpen() {
    return this.selectorContainer.classList.contains('open')
  }

  _focus() {
    if (!this.selectorContainer.classList.contains('focused')) {
      this.selectorContainer.classList.add('focused')
    }
  }

  _activeSelector(isActive = true) {
    if (isActive || !this.selectorContainer.classList.contains('active')) {
      this.selectorContainer.classList.add('active')
    } else {
      this.selectorContainer.classList.remove('active')
    }
  }

  _unfocus() {
    if (this.selectorContainer.classList.contains('focused')) {
      this.selectorContainer.classList.remove('focused')
    }
  }

  _handle() {
    this.inputContainer.addEventListener('click', (event) => {
      event.stopPropagation()
      this.openToggle()
    })

    this.dropdownContainer.addEventListener('click', (event) => {
      event.stopPropagation()
      const elem = event.target
      if (!elem.classList.contains('dropdown_select')) {
        this.set(elem.dataset.item)
        this.close()
      }
    })

    this.html.addEventListener('click', (event) => {
      this.close()
    })
  }

  async _fetch() {
    this.label.innerText = 'Загрузка...'
    const response = await fetch(this.options.url)
    const data = await response.json()
    this.label.innerText = this.options.label
    this.data = Object.keys(data).map((key) => {
      data[key].id = key
      return data[key]
    })
    this._createSelector(this.data)
    this._fillDropdown(this.data)
    this.render()
  }
}
