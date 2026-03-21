//手順　UI部分

'use client'

import DeleteIcon from "../../image/deleteicon"

export type Step = { 
  recipestep :string
 }

type Props = {
  steps : Step[],
  addStep : () => void ,
  removeStep : ( index : number) => void ,
  recipeStepChange  : ( index : number , value : string ) => void ,
}

const StepList = ({steps,addStep,removeStep,recipeStepChange}:Props) => {
  const MAX_STEP = 20//最大追加可能数

  return(
    <div className='flex flex-col w-full gap-3'>
      <label>作り方</label>


      {steps.map (( step , index ) => (
        <div key={index}
          className="flex gap-2"
        >

        {index >= 1 &&(
          <button
            type='button'
            onClick={()=>removeStep(index)}
            aria-label="手順を削除"
          >
            <DeleteIcon />
          </button>
        )}

        <span>{index+1}.</span>
        <input
          className="w-3/4 px-2 border-b"
          value={step.recipestep}
          placeholder="手順を入力"
          onChange={(e)=>recipeStepChange(index,e.target.value)}
        />
        </div>
      ))}
      {steps.length < 20 && (//最大数超えたら追加ボタンを非表示
        <div className="flex justify-center">
          <button
            type='button'
            onClick={addStep}
            className="cursor-pointer"
          >
            <img
              src="/images/buttonstepadd.png"
              alt="手順を追加"
              width={100}
            />
          </button>
        </div>
      )}
    
    </div>
  )
 }
 export default StepList;
