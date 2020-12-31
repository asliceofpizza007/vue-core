import store from '@/store'

const requireComponent = require.context('@v/pages/', true, /\.vue$/)
const AvailablePages = []
requireComponent.keys().forEach(fileName => {
  // Get the Kebab version of the component name
  const componentName = fileName
    // Remove './' from the begin
    .replace(/\.\//, '')
    // Change all '/' to '-'
    .replace(/\//g, '-')
    // Remove the file extension from the end
    .replace(/\.\w+$/, '')
    .split('-')[1]

  const pattern = /Index|LogIn/

  if (!fileName.includes('subComponents') && !pattern.test(componentName)) {
    AvailablePages.push(componentName)
  }
})

store.dispatch('app/setPageComponents', AvailablePages)
