export default function weather(d, s, id) {
  let js
  const fjs = d.getElementsByTagName(s)[0]
  if (!d.getElementById(id)) {
    js = d.createElement(s)
    js.id = id; js.src = 'https://weatherwidget.io/js/widget.min.js'
    fjs.parentNode.insertBefore(js, fjs)
  }
}
