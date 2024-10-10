import React from 'react'
import { Trash2, Check } from 'lucide-react'

interface StoryboardSequenceProps {
  images: string[]
  onDelete: () => void
  isSelected: boolean
  onToggleSelection: () => void
}

const StoryboardSequence: React.FC<StoryboardSequenceProps> = ({ images, onDelete, isSelected, onToggleSelection }) => {
  return (
    <div className={`relative border-4 rounded-lg p-4 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <div key={index} className="relative">
            <img src={src} alt={`Storyboard ${index + 1}`} className="w-full h-auto rounded-md shadow-md" />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 rounded-br-md">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute -top-4 right-0 flex space-x-2">
        <button
          onClick={onToggleSelection}
          className={`p-2 rounded-full ${isSelected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
        >
          <Check size={20} />
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  )
}

export default StoryboardSequence