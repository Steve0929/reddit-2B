import Image from 'next/image';
import React from 'react';

interface CardProps {
  title?: string,
  image?: string,
  children: React.ReactNode
}

const Card = ({ title, image, children }: CardProps) => {

  return (
    <div className='bg-white shadow-even p-8 mt-4 rounded-xl'>
      <div className='flex items-center'>
        <p className='font-semibold text-gray-600 text-xl mt-2'>{title}</p>
        <div className="ml-auto ugummy">
          {image ? <Image src={`${image}`} width={33} height={33} alt='title-img' /> : null}
        </div>
      </div>
      <div className="flex-grow border-t border-gray-200 mb-6 mt-4  border-dashed" />
      {children}
    </div>
  )
}

export default Card;