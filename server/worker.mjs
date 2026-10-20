import { handleApi } from './api.mjs'

export default {
  async fetch(request, env) {
    const response = await handleApi(request, env)
    if (response) return response
    return env.ASSETS.fetch(request)
  }
}
