import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isUserOrOrganizationPage = repositoryName?.endsWith('.github.io')
const base =
  process.env.GITHUB_ACTIONS === 'true' &&
  repositoryName &&
  !isUserOrOrganizationPage
    ? `/${repositoryName}/`
    : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
