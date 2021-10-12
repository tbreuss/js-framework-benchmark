import m from 'mithril'

const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']

const random = (max) => {
  return Math.round(Math.random() * 1000) % max
}

const buildData = (count = 1000, state) => {
  let data = []
  for (let i = 0; i < count; i++)
    data.push({
      id: state.id++,
      label:
        adjectives[random(adjectives.length)] +
        ' ' +
        colours[random(colours.length)] +
        ' ' +
        nouns[random(nouns.length)]
    })
  return data
}

const State = () => ({
  data: [],
  selected: undefined,
  id: 1,
})

const Actions = state => ({
  select: (id) => {
    state.selected = id
  },
  run: () => {
    state.data = buildData(1000, state)
    state.selected = undefined
  },
  runLots: () => {
    state.data = buildData(10000, state)
    state.selected = undefined
  },
  add: () => {
    state.data = state.data.concat(buildData(1000, state))
  },
  update: () => {
    for (let i = 0; i < state.data.length; i += 10) {
      state.data[i].label += ' !!!'
    }
  },
  remove: (id) => {
    state.data = state.data.filter((d) => d.id !== id)
  },
  clear: () => {
    state.data = []
    state.selected = undefined
  },
  swapRows: () => {
    if (state.data.length > 998) {
      let temp = state.data[1]
      state.data[1] = state.data[998]
      state.data[998] = temp
    }
  }
})

const Button = (action, id, label) => m('div.col-sm-6.smallpad',
  m('button.btn.btn-primary.btn-block', {
    type: 'button',
    id: id,
    onclick: action
  }, label)
)

const ButtonGroup = (actions) => m('div.col-md-6',
  Button(actions.run, 'run', 'Create 1,000 rows'),
  Button(actions.runLots, 'runlots', 'Create 10,000 rows'),
  Button(actions.add, 'add', 'Append 1,000 rows'),
  Button(actions.update, 'update', 'Update every 10th row'),
  Button(actions.clear, 'clear', 'Clear'),
  Button(actions.swapRows, 'swaprows', 'Swap Rows'),
)

const Row = (row, state, actions) => m('tr', {key: row.id, class: row.id === state.selected ? 'danger' : ''},
  m('td.col-md-1', row.id),
  m('td.col-md-4', m('a', {onclick: () => actions.select(row.id)}, row.label)),
  m('td.col-md-1', m('a', {onclick: () => actions.remove(row.id)},
    m('span.glyphicon.glyphicon-remove', {'aria-hidden': true})
  )),
  m('td.col-md-6', '')
)

m.mount(document.getElementById('main'), () => {

  const state = State()
  const actions = Actions(state)

  return {
    view: () => m('div.container',
      m('div.jumbotron',
        m('div.row',
          m('div.col-md-6',
            m('h1', 'Mithril-optimized-"keyed"')
          ),
          ButtonGroup(actions)
        )
      ),
      m('table.table.table-hover.table-striped.test-data',
        m('tbody#tbody',
          state.data.map((row) => Row(row, state, actions))
        )
      )
    )
  }
})
