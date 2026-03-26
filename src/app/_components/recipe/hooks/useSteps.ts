//手順用カスタムフック
import { useState } from "react"

export type Step = { 
  recipestep : string
}

const useSteps = () => {
  const [ steps , setSteps ] = useState<Step[]>([{recipestep:''}])  //手順

  //手順　追加ボタン
  const addStep = () => {
    setSteps([...steps,{ recipestep : '' } ] )
  }

  //手順　削除ボタン
  const removeStep = (index:number) => {
    if( steps.length === 1) return
    setSteps(steps.filter (( _ , i ) => ( i !== index)) )
  } 
  return { steps , setSteps , addStep , removeStep }
}

export default useSteps;