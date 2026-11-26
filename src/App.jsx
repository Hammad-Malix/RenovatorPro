import { useCallback, useEffect, useRef, useState } from 'react'
import BuildProcess from './components/BuildProcess.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import CostEstimator from './components/CostEstimator.jsx'
import ProjectModal from './components/ProjectModal.jsx'
import ProjectGallery from './components/ProjectGallery.jsx'
import { getProjectTypeForCategory } from './utils/projectPricing.js'

function App() {
  const estimatorRef = useRef(null)
  const returnFocusRef = useRef(null)
  const modalWasOpenRef = useRef(false)
  const pendingEstimatorRequestRef = useRef(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedProjectType, setSelectedProjectType] = useState('')
  const [estimatorStep, setEstimatorStep] = useState(1)
  const focusEstimator = useCallback(() => {
    setEstimatorStep(1)
    estimatorRef.current.focus({ preventScroll: true })
  }, [])
  const openProject = useCallback((project, trigger) => {
    returnFocusRef.current = trigger
    setSelectedProject(project)
  }, [])
  const closeProject = useCallback(() => setSelectedProject(null), [])
  const requestSimilarBuild = useCallback((project) => {
    setSelectedProjectType(getProjectTypeForCategory(project.category))
    setEstimatorStep(1)
    pendingEstimatorRequestRef.current = true
    setSelectedProject(null)
  }, [])

  useEffect(() => {
    if (selectedProject) {
      modalWasOpenRef.current = true
    } else if (modalWasOpenRef.current) {
      modalWasOpenRef.current = false
      if (pendingEstimatorRequestRef.current) {
        pendingEstimatorRequestRef.current = false
        const estimator = estimatorRef.current
        estimator.focus({ preventScroll: true })
        estimator.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        })
      } else if (returnFocusRef.current?.isConnected) {
        returnFocusRef.current.focus({ preventScroll: true })
      }
    }
  }, [selectedProject])

  return (
    <div className="app">
      <Header onEstimateClick={focusEstimator} />
      <main>
        <Hero onEstimateClick={focusEstimator} />
        <ProjectGallery onOpenProject={openProject} />
        <CostEstimator
          activeStep={estimatorStep}
          estimatorRef={estimatorRef}
          onProjectTypeChange={setSelectedProjectType}
          onStepChange={setEstimatorStep}
          projectType={selectedProjectType}
        />
        <BuildProcess />
      </main>
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={closeProject}
          onRequestSimilar={requestSimilarBuild}
        />
      )}
      <Footer onEstimateClick={focusEstimator} />
    </div>
  )
}

export default App
