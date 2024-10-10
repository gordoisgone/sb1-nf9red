import React from 'react'
import OptimizedVideoEditor from './components/OptimizedVideoEditor'

// Sample image URLs (replace with your actual image URLs)
const sampleMedia = [
  'https://picsum.photos/seed/1/300/200',
  'https://picsum.photos/seed/2/300/200',
  'https://picsum.photos/seed/3/300/200',
  'https://picsum.photos/seed/4/300/200',
  'https://picsum.photos/seed/5/300/200',
  'https://picsum.photos/seed/6/300/200',
]

function App() {
  return (
    <div className="App">
      <OptimizedVideoEditor initialMedia={sampleMedia} />
    </div>
  )
}

export default App