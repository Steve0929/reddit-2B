import Image from "next/image"

import Card from "../common/Card"


export const Processing = () => {

  return (
    <Card >
      <p className="text-gray-700 text-lg font-semibold mb-2 text-center">Your video is now being created </p>
      <p className="text-center text-gray-600">
        It should be ready for download in a few minutes.
      </p>
      <div className="m-auto w-fit bounce">
        <Image src="/machine.png" quality={100} width={140} height={140} alt='machine' />
      </div>
    </Card >

  )
}