import React from 'react';

import Card from '../common/Card';
import { confObject,MINMUM_COMMENTS, stepComponentProps } from '../../constants';

interface InputNumberProps {
  value: number,
  increaseValue: (value: any) => void,
  decreaseValue: (value: any) => void,
  onChange: (value: any) => void,
  label: string
}

const InputNumber = ({ value, increaseValue, decreaseValue, onChange, label }: InputNumberProps) => {
  return (
    <div className="flex flex-row items-center relative bg-transparent m-auto mt-4">
      <div className='w-1/2'>
        <p className='mr-2 text-gray-600 text-xl'>{label}</p>
      </div>
      <div className='flex flex-row h-10'>
        <button onClick={decreaseValue}
          className="bg-[#5AB3FF] text-white h-full w-20 rounded-l cursor-pointer outline-none">
          <span className="m-auto text-2xl font-thin">-</span>
        </button>
        <input type="number"
          onChange={onChange}
          className="outline-none focus:outline-none text-center w-full bg-blue-100 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center outline-none"
          value={value}
        ></input>
        <button onClick={increaseValue}
          className="bg-[#5AB3FF] text-white h-full w-20 rounded-r cursor-pointer">
          <span className="m-auto text-2xl font-thin">+</span>
        </button>
      </div>
    </div >
  )
}

export const Comments = ({ conf, setConf }: stepComponentProps) => {
  const increaseValue = (field: keyof confObject) => {
    return setConf((prev: confObject) => ({ ...prev, [field]: (prev[field] as number) + 1 }));
  }

  const decreaseValue = (field: keyof confObject) => {
    return setConf((prev: confObject) => ({ ...prev, [field]: Math.max((prev[field] as number) - 1, MINMUM_COMMENTS) }));
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    return setConf((prev: confObject) => (
      { ...prev, [field]: parseInt(e.target.value) > MINMUM_COMMENTS ? e.target.value : MINMUM_COMMENTS }
    ))
  }

  const NUM_COMMENTS_FIELD = 'numComments';
  const NUM_REPLIES_FIELD = 'numReplies';

  return (
    <Card title='2. Select the number of comments and replies' image='/speech.png'>
      <InputNumber label='Number of comments'
        value={conf[NUM_COMMENTS_FIELD]}
        increaseValue={() => increaseValue(NUM_COMMENTS_FIELD)}
        decreaseValue={() => decreaseValue(NUM_COMMENTS_FIELD)}
        onChange={(e) => onChange(e, NUM_COMMENTS_FIELD)}
      />

      <InputNumber label='Number of replies per comment'
        value={conf[NUM_REPLIES_FIELD]}
        increaseValue={() => increaseValue(NUM_REPLIES_FIELD)}
        decreaseValue={() => decreaseValue(NUM_REPLIES_FIELD)}
        onChange={(e) => onChange(e, NUM_REPLIES_FIELD)}
      />
    </Card >
  )
}
