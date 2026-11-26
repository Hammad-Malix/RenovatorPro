const processSteps = [
  {
    title: 'Free Consultation & 3D Design',
    description:
      'We discuss your goals, assess your space, and shape the design with a detailed 3D plan.',
  },
  {
    title: 'Fixed-Price Proposal',
    description:
      'Review a clear scope, itemized fixed-price proposal, and a realistic project schedule.',
  },
  {
    title: 'Permits & Scheduled Construction',
    description:
      'We coordinate required permits, confirm your start date, and manage construction through to completion.',
  },
  {
    title: 'Final Walkthrough & 15-Year Warranty',
    description:
      'Walk through the finished work with our team and receive your 15-year structural warranty.',
  },
]

function BuildProcess() {
  return (
    <section
      className="page-section build-process"
      id="process"
      aria-labelledby="process-heading"
    >
      <div className="build-process__content">
        <p className="build-process__eyebrow">Our Process</p>
        <h2 id="process-heading">A Clear Path From Plan to Completion</h2>
        <ol className="build-process__steps">
          {processSteps.map((step, index) => (
            <li className="build-process__step" key={step.title}>
              <span className="build-process__number" aria-hidden="true">
                {index + 1}
              </span>
              <div className="build-process__details">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default BuildProcess
