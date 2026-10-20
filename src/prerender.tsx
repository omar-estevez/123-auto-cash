import { renderToString } from 'react-dom/server'
import App from './App'
import type { Lang } from './i18n'

export function render(lang: Lang) {
  return renderToString(<App initialLang={lang} />)
}
